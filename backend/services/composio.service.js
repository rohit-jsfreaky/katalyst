import { Composio } from "@composio/core";
import dotenv from "dotenv";
dotenv.config();
const composio = new Composio();

const GOOGLE_CALENDAR_AUTH_CONFIG = process.env.GOOGLE_CALENDAR_AUTH_CONFIG;

async function getExisting(userId) {
  const all = await composio.connectedAccounts.list({ userIds: [userId] });
  return all.items.find(
    (acc) =>
      acc.authConfig.id === GOOGLE_CALENDAR_AUTH_CONFIG &&
      acc.status === "ACTIVE"
  );
}

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
};
