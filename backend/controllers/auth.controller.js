import jwt from "jsonwebtoken";

const getFrontendOrigin = () => process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "katalyst_jwt_secret";
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const createJwt = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      googleId: user.googleId || user.id,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );

export const googleCallbackHandler = (req, res) => {
  const targetOrigin = getFrontendOrigin();

  if (!req.user) {
    const failureUrl = new URL(targetOrigin);
    failureUrl.searchParams.set("auth", "failed");
    return res.redirect(failureUrl.toString());
  }

  const successUrl = new URL(targetOrigin);
  successUrl.searchParams.set("auth", "success");
  successUrl.searchParams.set("token", createJwt(req.user));
  return res.redirect(successUrl.toString());
};

export const googleFailureHandler = (_req, res) => {
  const targetOrigin = getFrontendOrigin();
  const failureUrl = new URL(targetOrigin);
  failureUrl.searchParams.set("auth", "failed");
  return res.redirect(failureUrl.toString());
};

export const getCurrentUser = (req, res) => {
  if (!req.authUser) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
      data: null,
    });
  }

  return res.json({
    success: true,
    message: "User retrieved successfully",
    data: req.authUser,
  });
};

export const logoutUser = (_req, res) => res.json({ success: true });
