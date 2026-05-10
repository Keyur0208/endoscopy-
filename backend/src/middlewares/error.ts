import { NextFunction, Request, Response } from 'express';
import { isCelebrateError } from 'celebrate';
import { AppError } from '../utils/app-error';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(404, 'Route not found'));
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (isCelebrateError(error)) {
    const validationDetails = Array.from(error.details.values()).flatMap((detail) =>
      detail.details.map((item) => item.message)
    );

    res.status(400).json({ message: 'Validation failed', details: validationDetails });
    return;
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({ message });
};