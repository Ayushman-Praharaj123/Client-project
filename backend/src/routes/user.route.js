import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getAllMembers,
  uploadProfilePhoto,
  getUserTransaction,
  addEmail,
  setPassword,
  changePassword,
  downloadIdCard,
  downloadReceipt,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { uploadProfile } from "../middleware/upload.middleware.js";

const router = express.Router();

// User profile routes
router.get("/profile", protectRoute, getUserProfile);
router.put("/profile", protectRoute, updateUserProfile);
router.post("/upload-photo", protectRoute, uploadProfile.single("photo"), uploadProfilePhoto);

// Email and password management
router.post("/add-email", protectRoute, addEmail);
router.post("/set-password", protectRoute, setPassword);
router.put("/change-password", protectRoute, changePassword);

// Transaction routes
router.get("/transaction", protectRoute, getUserTransaction);

// Public route for members
router.get("/members", getAllMembers);

// Public routes for downloading ID card and receipt (accessible via email links)
router.get("/download-id-card/:userId", downloadIdCard);
router.get("/download-receipt/:userId", downloadReceipt);

export default router;

