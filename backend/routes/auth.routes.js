import { Router } from "express";
import passport from "../config/passport.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
	googleCallbackHandler,
	googleFailureHandler,
	getCurrentUser,
	logoutUser,
} from "../controllers/auth.controller.js";

const router = Router();

router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		prompt: "select_account",
		session: false,
	})
);

router.get(
	"/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/api/auth/google/failure",
		session: false,
	}),
	googleCallbackHandler
);

router.get("/google/failure", googleFailureHandler);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", authenticate, logoutUser);

export default router;
