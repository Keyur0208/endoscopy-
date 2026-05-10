import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { findAdminUserById } from '../app/models/admin-user';
import { findAuthAccessTokenByTokenId, touchAuthAccessToken } from '../app/models/auth-access-token';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../config/types/auth';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/app-error';

interface TokenPayload {
  id: number;
  email: string;
  isAdmin: boolean;
  userType: 'admin' | 'user';
  tokenId: string;
  iat: number;
  exp: number;
}

export const authenticate = asyncHandler<AuthenticatedRequest>(async (req: AuthenticatedRequest, _res: Response, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(401, 'Authorization token is required');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload;
  const authAccessToken = await findAuthAccessTokenByTokenId(decoded.tokenId);

  if (!authAccessToken || authAccessToken.token !== token || authAccessToken.actorId !== decoded.id) {
    throw new AppError(401, 'Invalid token');
  }

  const user = decoded.userType === 'admin'
    ? await findAdminUserById(decoded.id)
    : await prisma.user.findFirst({ where: { id: decoded.id, isActive: true } });

  if (!user) {
    throw new AppError(401, 'Invalid token');
  }

  await touchAuthAccessToken(authAccessToken.tokenId);

  req.user = {
    id: user.id,
    email: user.email,
    isAdmin: decoded.userType === 'admin',
    fullName: user.fullName,
    userType: decoded.userType,
    tokenId: authAccessToken.tokenId,
    tokenType: authAccessToken.type,
    resourceInfo: authAccessToken.resourceInfo,
  };

  next();
});