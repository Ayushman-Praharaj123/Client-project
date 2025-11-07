import express from "express";
import {
  createRegistrationOrder,
  completeRegistration,
  login,
  logout,
  sendPasswordResetOTP,
  verifyOTP,
  resetPassword,
  sendRegistrationOTP,
  sendLoginOTP,
  loginWithOTP,
  createRenewalOrder,
  completeRenewal,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Registration routes
router.post("/create-order", createRegistrationOrder);
router.post("/complete-registration", completeRegistration);
router.post("/send-registration-otp", sendRegistrationOTP); // New: OTP-based registration
router.post("/verify-otp", verifyOTP); // Shared OTP verification

// Login & Logout
router.post("/login", login); // Password-based login
router.post("/send-login-otp", sendLoginOTP); // New: Send OTP for login
router.post("/login-with-otp", loginWithOTP); // New: OTP-based login
router.post("/logout", logout);

// Password reset
router.post("/send-otp", sendPasswordResetOTP);
router.post("/reset-password", resetPassword);

// Membership renewal
router.post("/create-renewal-order", protectRoute, createRenewalOrder);
router.post("/complete-renewal", protectRoute, completeRenewal);

// Check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user, role: req.user.role || "worker" });
});

export default router;
