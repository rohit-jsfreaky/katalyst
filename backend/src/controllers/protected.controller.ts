import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response.util.js';
import { AuthRequest } from '../types/user.types.js';

export const getProtectedData = (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  
  return sendSuccess(
    res,
    {
      message: 'This is protected data',
      user: authReq.user?.name,
      timestamp: new Date().toISOString(),
    },
    'Protected data retrieved successfully'
  );
};

