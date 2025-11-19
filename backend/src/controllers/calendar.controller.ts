import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { AuthRequest } from '../types/user.types.js';
import { fetchCalendarEvents } from '../services/calendar.service.js';
import { generateMeetingSummary } from '../services/gemini.service.js';

export const getCalendarEvents = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      return sendError(res, 'User not authenticated', 401);
    }

    const events = await fetchCalendarEvents(authReq.user);
    return sendSuccess(res, events, 'Calendar events fetched successfully');
  } catch (error: any) {
    console.error('Error in getCalendarEvents:', error);
    return sendError(res, error.message || 'Failed to fetch calendar events', 500);
  }
};

export const getMeetingSummary = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      return sendError(res, 'User not authenticated', 401);
    }

    const { title, description, attendees, duration } = req.body;

    if (!title) {
      return sendError(res, 'Meeting title is required', 400);
    }

    const summary = await generateMeetingSummary(
      title,
      description || '',
      Array.isArray(attendees) ? attendees : [],
      duration || 'Unknown'
    );

    return sendSuccess(res, summary, 'Meeting summary generated successfully');
  } catch (error: any) {
    console.error('Error in getMeetingSummary:', error);
    return sendError(res, error.message || 'Failed to generate meeting summary', 500);
  }
};

