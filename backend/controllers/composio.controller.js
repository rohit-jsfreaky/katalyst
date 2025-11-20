import { composioService } from "../services/composio.service.js";

export const checkConnection = async (req, res) => {
  try {
    const userId = req.params.userId;
    const status = await composioService.checkStatus(userId);
    return res.json(status);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const startConnection = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await composioService.connect(userId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const fetchEvents = async (req, res) => {
  try {
    const userId = req.params.userId;
    const events = await composioService.getEvents(userId);
    return res.json(events);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
