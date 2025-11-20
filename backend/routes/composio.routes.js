import { Router } from "express";
import {
  startConnection,
  checkConnection,
  fetchEvents
} from "../controllers/composio.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const composioRoutes = Router();

composioRoutes.use(authenticate);

composioRoutes.get("/status/:userId", checkConnection);
composioRoutes.get("/connect/:userId", startConnection);
composioRoutes.get("/events/:userId", fetchEvents);

export default composioRoutes;
