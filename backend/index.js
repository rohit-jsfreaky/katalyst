import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import composioRoutes from "./routes/composio.routes.js";

const app = express();
const CLIENT_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api/calendar", composioRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
