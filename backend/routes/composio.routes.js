import { Router } from "express";
import {
  startConnection,
  checkConnection,
  fetchEvents
} from "../controllers/composio.controller.js";

const composioRoutes = Router();

composioRoutes.get("/status/:userId", checkConnection);
composioRoutes.get("/connect/:userId", startConnection);
composioRoutes.get("/events/:userId", fetchEvents);

export default composioRoutes;
