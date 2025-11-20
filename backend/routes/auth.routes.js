import { Router } from "express";
import passport from "../config/passport.js";
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
	})
);

router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/api/auth/google/failure" }),
	googleCallbackHandler
);

router.get("/google/failure", googleFailureHandler);
router.get("/me", getCurrentUser);
router.post("/logout", logoutUser);

export default router;
