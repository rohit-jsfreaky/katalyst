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
