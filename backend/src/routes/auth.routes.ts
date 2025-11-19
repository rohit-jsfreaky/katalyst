import { Router } from 'express';
import passport from 'passport';
import {
  googleAuth,
  googleCallback,
  getCurrentUser,
  logout,
} from '../controllers/auth.controller.js';

export const authRoutes = Router();

// Google OAuth routes
authRoutes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

authRoutes.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleCallback
);

// Get current user
authRoutes.get('/me', getCurrentUser);

// Logout
authRoutes.post('/logout', logout);

