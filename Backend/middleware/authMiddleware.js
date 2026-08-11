import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ==========================================
// PROTECT ROUTES
// ==========================================

export const protect = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token missing.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled.",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Not authorized. Invalid or expired token.",
    });
  }
};

// ==========================================
// ADMIN ONLY
// ==========================================

export const admin = (
  req,
  res,
  next
) => {

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authorized.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  next();
};

// ==========================================
// ADMIN ONLY ALIAS
// ==========================================

export const adminOnly = (
  req,
  res,
  next
) => {

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authorized.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  next();
};