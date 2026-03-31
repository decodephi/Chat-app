const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protects routes by verifying the JWT from the Authorization header.
 * Attaches the authenticated user to req.user on success.
 */
const protect = async (req, res, next) => {
  let token;

  // Support both "Bearer <token>" header and cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user without password
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token invalid" });
  }
};

module.exports = { protect };
