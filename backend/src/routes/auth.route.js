import express from "express";
import {
  createRegistrationOrder,
  completeRegistration,
  login,
  logout,
  sendPasswordResetOTP,
  verifyOTP,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Registration routes
router.post("/create-order", createRegistrationOrder);
router.post("/complete-registration", completeRegistration);

// Login & Logout
router.post("/login", login);
router.post("/logout", logout);

// Password reset
router.post("/send-otp", sendPasswordResetOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user, role: req.user.role || "worker" });
});

export default router;
