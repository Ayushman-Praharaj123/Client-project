import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getAllMembers,
  uploadProfilePhoto,
  getUserTransaction,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { uploadProfile } from "../middleware/upload.middleware.js";

const router = express.Router();

// User profile routes
router.get("/profile", protectRoute, getUserProfile);
router.put("/profile", protectRoute, updateUserProfile);
router.post("/upload-photo", protectRoute, uploadProfile.single("photo"), uploadProfilePhoto);

// Transaction routes
router.get("/transaction", protectRoute, getUserTransaction);

// Public route for members
router.get("/members", getAllMembers);

export default router;

