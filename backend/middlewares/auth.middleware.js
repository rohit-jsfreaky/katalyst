import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "katalyst_jwt_secret";

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Missing authorization token",
      data: null,
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.authUser = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.googleId || payload.sub,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      data: null,
    });
  }
};
