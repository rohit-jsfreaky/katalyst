import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieSession from "cookie-session";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import composioRoutes from "./routes/composio.routes.js";

const app = express();
const CLIENT_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const SESSION_SECRET = process.env.SESSION_SECRET || "katalyst_session_secret";
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

app.set("trust proxy", 1);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: "session",
    keys: [SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    httpOnly: true,
  })
);

const attachSessionHelpers = (req) => {
  if (!req.session) {
    return;
  }

  if (typeof req.session.save !== "function") {
    req.session.save = (cb = () => {}) => cb();
  }

  if (typeof req.session.regenerate !== "function") {
    req.session.regenerate = (cb = () => {}) => {
      req.session = {};
      attachSessionHelpers(req);
      cb();
    };
  }
};

app.use((req, _res, next) => {
  attachSessionHelpers(req);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth", authRoutes);
app.use("/api/calendar", composioRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
