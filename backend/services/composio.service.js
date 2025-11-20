import { Composio } from "@composio/core";
import dotenv from "dotenv";
dotenv.config();
const composio = new Composio();

const GOOGLE_CALENDAR_AUTH_CONFIG = process.env.GOOGLE_CALENDAR_AUTH_CONFIG;
const DEFAULT_SUMMARY_LIMIT = 5;
const DEFAULT_SUMMARY_LOOKBACK_DAYS = 30;

async function getExisting(userId) {
  const all = await composio.connectedAccounts.list({ userIds: [userId] });
  return all.items.find(
    (acc) =>
      acc.authConfig.id === GOOGLE_CALENDAR_AUTH_CONFIG &&
      acc.status === "ACTIVE"
  );
}

const extractEventArray = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  const candidates = [payload.items, payload.events, payload.data];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }

    if (candidate && Array.isArray(candidate.items)) {
      return candidate.items;
    }
  }

  return [];
};

const getEventStartDate = (event) => {
  if (!event) return null;
  const raw = event?.start?.dateTime || event?.start?.date;
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const cleanText = (value, maxLength = 400) => {
  if (!value) return "";
  const stripped = String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (stripped.length <= maxLength) {
    return stripped;
  }
  return `${stripped.slice(0, maxLength)}...`;
};

const splitDescriptionSegments = (description) => {
  if (!description) return [];

  return cleanText(description, 1200)
    .split(/\r?\n|•|-\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
};

const extractHighlightsFromDescription = (description) => {
  const segments = splitDescriptionSegments(description);

  const keyDecisions = [];
  const nextSteps = [];

  for (const segment of segments) {
    const lower = segment.toLowerCase();

    if (
      keyDecisions.length < 3 &&
      (lower.includes("decision") ||
        lower.includes("decided") ||
        lower.includes("agreed") ||
        lower.startsWith("approved"))
    ) {
      keyDecisions.push(segment);
      continue;
    }

    if (
      nextSteps.length < 3 &&
      (lower.includes("next step") ||
        lower.includes("follow up") ||
        lower.includes("action item") ||
        lower.includes("action:") ||
        lower.startsWith("todo"))
    ) {
      nextSteps.push(segment);
    }
  }

  return { keyDecisions, nextSteps };
};

const uniqueList = (list) => {
  const seen = new Set();
  const result = [];
  for (const item of list) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
};

const getTopOccurrence = (items) => {
  const counts = new Map();
  for (const item of items) {
    if (!item) continue;
    counts.set(item, (counts.get(item) || 0) + 1);
  }

  let topItem = null;
  let topCount = 0;

  for (const [item, count] of counts.entries()) {
    if (count > topCount) {
      topItem = item;
      topCount = count;
    }
  }

  return topItem ? { value: topItem, count: topCount } : null;
};

const getAttendeeList = (event) => {
  if (!Array.isArray(event?.attendees)) {
    return [];
  }
  const names = event.attendees
    .map((attendee) => attendee.displayName || attendee.email || null)
    .filter(Boolean)
    .map((value) => cleanText(value, 100));
  return uniqueList(names);
};

const formatDateForSummary = (event) => {
  const start = getEventStartDate(event);
  if (!start) return "";
  const iso = start.toISOString();
  return iso ? iso.slice(0, 10) : "";
};

const buildMockStructuredSummary = (events) => {
  if (!events.length) {
    return {
      insights: [],
      meetings: [],
    };
  }

  const sorted = [...events].sort((a, b) => {
    const aDate = getEventStartDate(a);
    const bDate = getEventStartDate(b);
    const aTime = aDate ? aDate.getTime() : 0;
    const bTime = bDate ? bDate.getTime() : 0;
    return bTime - aTime;
  });

  const attendeesAcrossMeetings = [];
  const locationsAcrossMeetings = [];

  const dateRangeLabel = (() => {
    const first = getEventStartDate(sorted[sorted.length - 1]);
    const last = getEventStartDate(sorted[0]);
    const startLabel = first ? first.toISOString().slice(0, 10) : null;
    const endLabel = last ? last.toISOString().slice(0, 10) : null;
    if (startLabel && endLabel && startLabel !== endLabel) {
      return `${startLabel} to ${endLabel}`;
    }
    return endLabel || "recent";
  })();

  const meetings = sorted.map((event) => {
    const attendees = getAttendeeList(event);
    attendeesAcrossMeetings.push(...attendees);

    const location = cleanText(event?.location || "", 120);
    if (location) {
      locationsAcrossMeetings.push(location);
    }

    const { keyDecisions, nextSteps } = extractHighlightsFromDescription(
      event?.description || ""
    );

    return {
      title: cleanText(event?.summary || "Untitled event", 120) || "Untitled event",
      date: formatDateForSummary(event) || "",
      attendees,
      keyDecisions,
      nextSteps,
    };
  });

  const insights = [
    `Captured ${events.length} meeting${events.length === 1 ? "" : "s"} from ${dateRangeLabel}.`,
  ];

  const mostRecent = sorted[0];
  const mostRecentDate = formatDateForSummary(mostRecent);
  const mostRecentTitle = cleanText(mostRecent?.summary || "Untitled event", 120);
  if (mostRecentDate) {
    insights.push(`Most recent session: ${mostRecentTitle} on ${mostRecentDate}.`);
  }

  const topAttendee = getTopOccurrence(attendeesAcrossMeetings);
  if (topAttendee) {
    insights.push(
      `Most frequent attendee: ${topAttendee.value} (${topAttendee.count} meeting${
        topAttendee.count === 1 ? "" : "s"
      }).`
    );
  }

  const topLocation = getTopOccurrence(locationsAcrossMeetings);
  if (topLocation) {
    insights.push(`Popular location: ${topLocation.value}.`);
  }

  return {
    insights,
    meetings,
  };
};


export const composioService = {
  async checkStatus(userId) {
    const existing = await getExisting(userId);

    if (existing) {
      return { connected: true, connectionId: existing.id };
    }

    return { connected: false };
  },

  async connect(userId) {
    const existing = await getExisting(userId);

    if (existing) {
      return {
        connected: true,
        alreadyConnected: true,
        connectionId: existing.id,
      };
    }

    const request = await composio.connectedAccounts.initiate(
      userId,
      GOOGLE_CALENDAR_AUTH_CONFIG
    );

    return {
      connected: false,
      redirectUrl: request.redirectUrl,
      connectionRequestId: request.id,
    };
  },

  async getEvents(userId) {
    // 1. Ensure existing account
    const existing = await getExisting(userId);
    if (!existing) throw new Error("User not connected");

    // 2. Find the tool slug
    const tool = await composio.tools.getRawComposioToolBySlug(
      "GOOGLECALENDAR_EVENTS_LIST"
    );

    // console.log("tool", tool);

    // 3. Execute
    const now = Date.now();
    const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;

    const response = await composio.tools.execute(tool.slug, {
      userId,
      connectedAccountId: existing.id,
      calendarId: "primary",
      arguments: {
        timeMin: new Date(now - fiveDaysMs).toISOString(),
        timeMax: new Date(now + fiveDaysMs).toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        calendarId: "primary",
      },
      dangerouslySkipVersionCheck: true,
    });

    console.log("response", response);

    return response.data; // or response.output depending on the SDK version
  },

  async generateMeetingSummary(
    userId,
    { limit = DEFAULT_SUMMARY_LIMIT, lookbackDays = DEFAULT_SUMMARY_LOOKBACK_DAYS } = {}
  ) {
    const rawEvents = await this.getEvents(userId);
    const events = extractEventArray(rawEvents);

    if (!events.length) {
      return {
        summary: {
          insights: [],
          meetings: [],
        },
        events: [],
        generatedAt: new Date().toISOString(),
      };
    }

    const now = new Date();
    const lookbackThreshold = new Date(
      now.getTime() - lookbackDays * 24 * 60 * 60 * 1000
    );

    const pastEvents = events
      .filter((event) => {
        const start = getEventStartDate(event);
        return start && start < now && start >= lookbackThreshold;
      })
      .sort((a, b) => {
        const dateA = getEventStartDate(a);
        const dateB = getEventStartDate(b);
        const timeA = dateA ? dateA.getTime() : 0;
        const timeB = dateB ? dateB.getTime() : 0;
        return timeB - timeA;
      });

    const selectedEvents = pastEvents.slice(0, Math.max(limit, 1));

    if (!selectedEvents.length) {
      return {
        summary: {
          insights: [],
          meetings: [],
        },
        events: [],
        generatedAt: new Date().toISOString(),
      };
    }

    const summaryPayload = buildMockStructuredSummary(selectedEvents);

    return {
      summary: summaryPayload,
      events: selectedEvents,
      generatedAt: new Date().toISOString(),
    };
  },
};
