import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { getCalendarEvents, getMeetingSummary } from '../controllers/calendar.controller.js';

export const calendarRoutes = Router();

// All routes here require authentication
calendarRoutes.use(isAuthenticated);

// Get upcoming and past meetings
calendarRoutes.get('/events', getCalendarEvents);

// Generate AI summary for a meeting
calendarRoutes.post('/summary', getMeetingSummary);

