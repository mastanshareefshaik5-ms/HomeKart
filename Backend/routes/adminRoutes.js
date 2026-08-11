import express from "express";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  adminOnly,
  (req, res) => {
    res.json({
      success: true,
      message: "Admin API access granted",
      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);

export default router;