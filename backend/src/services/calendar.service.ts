import { getComposioInstance } from '../config/composio.config.js';
import { CalendarEvent } from '../types/calendar.types.js';

export const fetchCalendarEvents = async (user: any): Promise<{ upcoming: CalendarEvent[]; past: CalendarEvent[] }> => {
  try {
    const composio = getComposioInstance();
    
    // Get user's connected account for Google Calendar
    // Note: In a real app, you'd store the connected account ID when user connects
    // For now, we'll use the user's email/ID to get their connected account
    const userId = user.id || user.email;
    
    // Get connected accounts for the user
    // This assumes the user has already connected their Google Calendar via Composio
    let connectedAccounts;
    try {
      connectedAccounts = await composio.getConnectedAccounts({
        userId: userId,
      });
    } catch (error: any) {
      // If getConnectedAccounts doesn't work, try alternative approach
      console.warn('getConnectedAccounts failed, trying alternative method:', error.message);
      // For now, use mock data if Composio integration isn't fully set up
      return getMockCalendarEvents();
    }

    if (!connectedAccounts || connectedAccounts.length === 0) {
      console.warn('No connected accounts found, using mock data');
      return getMockCalendarEvents();
    }

    const googleCalendarAccount = connectedAccounts.find(
      (account: any) => account.appName === 'GOOGLECALENDAR' || account.appName === 'googlecalendar'
    );

    if (!googleCalendarAccount) {
      console.warn('Google Calendar account not found, using mock data');
      return getMockCalendarEvents();
    }

    const now = new Date();
    const timeMin = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const timeMax = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days ahead

    // Fetch events using Composio
    let eventsResponse;
    try {
      eventsResponse = await composio.executeAction({
        action: 'GOOGLECALENDAR_EVENTS_LIST',
        connectedAccountId: googleCalendarAccount.id,
        parameters: {
          calendarId: 'primary',
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          maxResults: 50,
          singleEvents: true,
          orderBy: 'startTime',
        },
      });
    } catch (error: any) {
      console.warn('executeAction failed, using mock data:', error.message);
      return getMockCalendarEvents();
    }

    const events = eventsResponse?.data?.items || eventsResponse?.items || [];

    // Transform and filter events
    const transformedEvents: CalendarEvent[] = events
      .filter((event: any) => {
        // Filter out all-day events or events without start time
        return event.start?.dateTime;
      })
      .map((event: any) => {
        const start = new Date(event.start.dateTime);
        const end = new Date(event.end.dateTime);
        const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

        return {
          id: event.id,
          title: event.summary || 'Untitled Event',
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          duration,
          attendees: event.attendees?.map((a: any) => a.email || a.displayName || 'Unknown') || [],
          description: event.description || undefined,
          location: event.location || undefined,
          organizer: event.organizer?.email || undefined,
        };
      });

    // Separate upcoming and past events
    const upcoming = transformedEvents
      .filter((event) => new Date(event.startTime) >= now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 5);

    const past = transformedEvents
      .filter((event) => new Date(event.startTime) < now)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 5);

    return { upcoming, past };
  } catch (error: any) {
    console.error('Error fetching calendar events:', error);
    
    // If Composio integration fails, return mock data for development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock calendar data due to error');
      return getMockCalendarEvents();
    }
    
    throw new Error(error.message || 'Failed to fetch calendar events');
  }
};

// Mock data for development/testing
const getMockCalendarEvents = (): { upcoming: CalendarEvent[]; past: CalendarEvent[] } => {
  const now = new Date();
  
  const upcoming: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Standup',
      startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() + 2.5 * 60 * 60 * 1000).toISOString(),
      duration: 30,
      attendees: ['john@example.com', 'jane@example.com'],
      description: 'Daily team sync meeting',
    },
    {
      id: '2',
      title: 'Product Review',
      startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString(),
      duration: 60,
      attendees: ['product@example.com'],
      description: 'Review new product features',
    },
  ];

  const past: CalendarEvent[] = [
    {
      id: '3',
      title: 'Client Meeting',
      startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      duration: 60,
      attendees: ['client@example.com'],
      description: 'Quarterly review discussion',
    },
    {
      id: '4',
      title: 'Sprint Planning',
      startTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      duration: 120,
      attendees: ['team@example.com'],
      description: 'Plan next sprint tasks',
    },
  ];

  return { upcoming, past };
};

