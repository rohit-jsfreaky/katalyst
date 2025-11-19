import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  console.error('Error:', err);
  
  return sendError(
    res,
    err.message || 'Internal server error',
    500
  );
};

