import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util.js';
import { AuthRequest } from '../types/user.types.js';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      isAuthenticated?: () => boolean;
      user?: any;
    }
  }
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthRequest;
  
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  sendError(res, 'Authentication required. Please login first.', 401);
};

