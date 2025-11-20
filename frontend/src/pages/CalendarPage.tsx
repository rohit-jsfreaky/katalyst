import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  checkCalendarStatus,
  connectCalendar,
  getCalendarEvents,
} from "../api/composio.api";
import {
  getCurrentUser,
  logout,
  redirectToGoogleLogin,
  type GoogleUser,
} from "../api/auth.api";
import LandingPage from "../components/LandingPage";
import Dashboard from "../components/Dashboard";

type CalendarBuckets = {
  upcoming: any[];
  past: any[];
};

const INITIAL_EVENTS: CalendarBuckets = { upcoming: [], past: [] };

const bucketEvents = (payload: any): CalendarBuckets => {
  if (!payload) {
    return INITIAL_EVENTS;
  }

  const upcoming = Array.isArray(payload.upcoming) ? payload.upcoming : [];
  const past = Array.isArray(payload.past) ? payload.past : [];

  if (upcoming.length > 0 || past.length > 0) {
    return {
      upcoming,
      past,
    };
  }

  const items = Array.isArray(payload.items) ? payload.items : [];
  if (items.length === 0) {
    return INITIAL_EVENTS;
  }

  const now = Date.now();

  const makeDate = (event: any) => {
    const value = event?.start?.dateTime || event?.start?.date;
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const bucketed = items.reduce(
    (acc: CalendarBuckets, event: any) => {
      const startDate = makeDate(event);
      if (!startDate) {
        acc.upcoming.push(event);
        return acc;
      }

      if (startDate.getTime() >= now) {
        acc.upcoming.push(event);
      } else {
        acc.past.push(event);
      }
      return acc;
    },
    { upcoming: [] as any[], past: [] as any[] }
  );

  return bucketed;
};

const CalendarPage: React.FC = () => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [events, setEvents] = useState<CalendarBuckets>(INITIAL_EVENTS);
  const [initializing, setInitializing] = useState(true);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const userId = useMemo(() => user?.googleId || user?.id || null, [user]);

  const refreshStatusAndEvents = useCallback(async () => {
    if (!userId) {
      return;
    }

    setStatusLoading(true);
    setEventsLoading(true);
    setStatusError(null);

    try {
      const statusResponse = await checkCalendarStatus(userId);
      setStatus(statusResponse);

      if (statusResponse?.connected) {
        const eventsResponse = await getCalendarEvents(userId);
        setEvents(bucketEvents(eventsResponse));
      } else {
        setEvents(INITIAL_EVENTS);
      }
    } catch (error) {
      console.error("Failed to load calendar data", error);
      setStatus(null);
      setEvents(INITIAL_EVENTS);
      setStatusError(
        "We couldn't reach your calendar right now. Please try again in a moment."
      );
    } finally {
      setStatusLoading(false);
      setEventsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const restoreSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const authStatus = params.get("auth");
      if (authStatus) {
        if (authStatus === "failed") {
          setAuthMessage("Google authentication failed. Please try again.");
        }

        params.delete("auth");
        const newQuery = params.toString();
        const nextUrl = `${window.location.pathname}${
          newQuery ? `?${newQuery}` : ""
        }${window.location.hash}`;
        window.history.replaceState({}, "", nextUrl);
      }

      try {
        const res = await getCurrentUser();
        if (res.success && res.data) {
          setUser(res.data);
          setAuthMessage(null);
        } else if (res.message && res.message !== "Not authenticated") {
          setAuthMessage(res.message);
        }
      } catch (error) {
        console.error("Unable to restore session", error);
      } finally {
        setInitializing(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    if (!userId) {
      setStatus(null);
      setEvents(INITIAL_EVENTS);
      return;
    }

    refreshStatusAndEvents();
  }, [userId, refreshStatusAndEvents]);



  const handleLogin = () => {
    setAuthMessage(null);
    redirectToGoogleLogin();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      setStatus(null);
      setEvents(INITIAL_EVENTS);
      setAuthMessage(null);
    }
  };

  const handleConnect = async () => {
    if (!userId) {
      setAuthMessage("Please sign in before connecting your calendar.");
      return;
    }

    setConnecting(true);
    try {
      const response = await connectCalendar(userId);

      if (response.alreadyConnected) {
        setStatus(response);
        setStatusError(null);
        await refreshStatusAndEvents();
        return;
      }

      if (response.redirectUrl) {
        window.open(response.redirectUrl, "_blank", "noopener,noreferrer");
        setAuthMessage("Complete the Google consent flow and return here And please once Reload the page");
      }
    } catch (error) {
      console.error("Failed to start calendar connection", error);
      setStatusError("Unable to start the connection. Please try again.");
    } finally {
      setConnecting(false);
    }
  };

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 rounded-full bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-lg ring-1 ring-white/10 backdrop-blur-md">
          <span className="inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-sky-400" />
          Preparing your dashboard…
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLogin={handleLogin} authMessage={authMessage} />;
  }

  return (
    <Dashboard
      user={user}
      status={status}
      events={events}
      loading={statusLoading || eventsLoading}
      connecting={connecting}
      statusError={statusError}
      authMessage={authMessage}
      onConnect={handleConnect}
      onLogout={handleLogout}
      onDismissAuthMessage={() => setAuthMessage(null)}
    />
  );
};

export default CalendarPage;
