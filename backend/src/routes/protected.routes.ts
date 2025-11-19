import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { getProtectedData } from '../controllers/protected.controller.js';

export const protectedRoutes = Router();

// All routes here require authentication
protectedRoutes.use(isAuthenticated);

// Protected routes
protectedRoutes.get('/data', getProtectedData);

