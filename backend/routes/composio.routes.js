import { Router } from "express";
import {
  startConnection,
  checkConnection,
  fetchEvents,
  summarizeMeetings,
} from "../controllers/composio.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const composioRoutes = Router();

composioRoutes.use(authenticate);

composioRoutes.get("/status/:userId", checkConnection);
composioRoutes.get("/connect/:userId", startConnection);
composioRoutes.get("/events/:userId", fetchEvents);
composioRoutes.get("/summary/:userId", summarizeMeetings);

export default composioRoutes;
