import { NextFunction, Response } from 'express';
import { AuthenticatedRequest, UserType } from '../config/types/auth';
import { AppError } from '../utils/app-error';
import { MESSAGES } from '../utils/messages';

export const allowRoles =
  (...roles: readonly UserType[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, MESSAGES.UNAUTHORIZED));
      return;
    }

    if (!roles.includes(req.user.userType)) {
      next(new AppError(403, MESSAGES.ADMIN_USER_ACCESS_ONLY));
      return;
    }

    next();
  };