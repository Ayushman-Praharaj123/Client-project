import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const uploadDirs = ["uploads/profiles", "uploads/receipts"];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration for profile photos
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profiles/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for images only
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Profile photo upload middleware
export const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

