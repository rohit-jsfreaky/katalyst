import { composioService } from "../services/composio.service.js";

const getTokenUserId = (req) => req.authUser?.googleId || req.authUser?.id;

const ensureSameUser = (req, res, userId) => {
  const tokenUserId = getTokenUserId(req);

  if (tokenUserId && tokenUserId !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return false;
  }

  return true;
};

export const checkConnection = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!ensureSameUser(req, res, userId)) {
      return;
    }
    const status = await composioService.checkStatus(userId);
    return res.json(status);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const startConnection = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!ensureSameUser(req, res, userId)) {
      return;
    }
    const result = await composioService.connect(userId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const fetchEvents = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!ensureSameUser(req, res, userId)) {
      return;
    }
    const events = await composioService.getEvents(userId);
    return res.json(events);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const summarizeMeetings = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!ensureSameUser(req, res, userId)) {
      return;
    }

    const options = {};
    const limitParam = req.query.limit;
    const lookbackParam = req.query.lookbackDays;

    if (typeof limitParam === "string") {
      const parsedLimit = Number.parseInt(limitParam, 10);
      if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
        options.limit = Math.min(parsedLimit, 10);
      }
    }

    if (typeof lookbackParam === "string") {
      const parsedLookback = Number.parseInt(lookbackParam, 10);
      if (!Number.isNaN(parsedLookback) && parsedLookback > 0) {
        options.lookbackDays = Math.min(parsedLookback, 90);
      }
    }

    const summary = await composioService.generateMeetingSummary(userId, options);
    return res.json(summary);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
