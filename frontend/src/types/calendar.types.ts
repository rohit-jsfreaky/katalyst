export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  attendees: string[];
  description?: string;
  location?: string;
  organizer?: string;
}

export interface CalendarEventsResponse {
  upcoming: CalendarEvent[];
  past: CalendarEvent[];
}

export interface MeetingSummary {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
}

export interface MeetingWithSummary extends CalendarEvent {
  aiSummary?: MeetingSummary;
}

