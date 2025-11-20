const getFrontendOrigin = () => process.env.FRONTEND_URL || "http://localhost:5173";

export const googleCallbackHandler = (req, res) => {
  const targetOrigin = getFrontendOrigin();

  if (!req.user) {
    const failureUrl = new URL(targetOrigin);
    failureUrl.searchParams.set("auth", "failed");
    return res.redirect(failureUrl.toString());
  }

  const successUrl = new URL(targetOrigin);
  successUrl.searchParams.set("auth", "success");
  return res.redirect(successUrl.toString());
};

export const googleFailureHandler = (_req, res) => {
  const targetOrigin = getFrontendOrigin();
  const failureUrl = new URL(targetOrigin);
  failureUrl.searchParams.set("auth", "failed");
  return res.redirect(failureUrl.toString());
};

export const getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
      data: null,
    });
  }

  const userPayload = {
    ...req.user,
    googleId: req.user.googleId || req.user.id,
  };

  return res.json({
    success: true,
    message: "User retrieved successfully",
    data: userPayload,
  });
};

export const logoutUser = (req, res, next) => {
  if (typeof req.logout === "function") {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session = null;
      return res.json({ success: true });
    });
  } else {
    req.session = null;
    return res.json({ success: true });
  }
};
