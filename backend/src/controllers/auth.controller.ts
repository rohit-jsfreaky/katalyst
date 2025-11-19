import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { AuthRequest } from '../types/user.types.js';

export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  // This will be handled by passport middleware
  next();
};

export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // This will be handled by passport middleware
  // After successful authentication, redirect to frontend
  const authReq = req as AuthRequest;
  if (authReq.user) {
    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?success=true`);
  } else {
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?success=false`);
  }
};

export const getCurrentUser = (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  
  if (authReq.user) {
    // Don't send sensitive tokens to frontend
    const { accessToken, refreshToken, ...userWithoutTokens } = authReq.user;
    return sendSuccess(res, userWithoutTokens, 'User retrieved successfully');
  }
  
  return sendError(res, 'User not authenticated', 401);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return sendError(res, 'Logout failed', 500);
    }
    req.session.destroy((err) => {
      if (err) {
        return sendError(res, 'Session destruction failed', 500);
      }
      return sendSuccess(res, null, 'Logged out successfully');
    });
  });
};

