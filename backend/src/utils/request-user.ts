import { AuthenticatedRequest, AuthenticatedUser } from '../config/types/auth';
import { AppError } from './app-error';
import { MESSAGES } from './messages';

export const getRequestUser = (req: AuthenticatedRequest): AuthenticatedUser => {
  if (!req.user) {
    throw new AppError(401, MESSAGES.UNAUTHORIZED);
  }

  return req.user;
};