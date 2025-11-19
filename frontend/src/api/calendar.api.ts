import { api } from '../utils/api.util';
import type { ApiResponse, CalendarEventsResponse, MeetingSummary } from '../types/api.types';
import type { CalendarEvent } from '../types/calendar.types';

export const calendarApi = {
  // Get upcoming and past meetings
  getCalendarEvents: async (): Promise<ApiResponse<CalendarEventsResponse>> => {
    return api.get<CalendarEventsResponse>('/calendar/events');
  },

  // Generate AI summary for a meeting
  getMeetingSummary: async (
    title: string,
    description: string,
    attendees: string[],
    duration: string
  ): Promise<ApiResponse<MeetingSummary>> => {
    return api.post<MeetingSummary>('/calendar/summary', {
      title,
      description,
      attendees,
      duration,
    });
  },
};

