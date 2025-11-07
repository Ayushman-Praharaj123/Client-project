import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  createDeleteRequest,
  getDeleteRequests,
  processDeleteRequest,
  getAllContacts,
  markContactResolved,
  getAnalytics,
  createAdminWorkerOrder,
  completeAdminWorkerAddition,
  getAllTransactions,
  getTransactionSummary,
  uploadAdminPhoto,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
} from "../controllers/admin.controller.js";
import { protectAdmin, protectSuperAdmin } from "../middleware/admin.middleware.js";
import { uploadProfile } from "../middleware/upload.middleware.js";

const router = express.Router();

// User management (Admin & Super Admin)
router.get("/users", protectAdmin, getAllUsers);
router.get("/users/:id", protectAdmin, getUserById);
router.put("/users/:id", protectAdmin, updateUser);

// Add worker manually with payment (Admin only)
router.post("/create-worker-order", protectAdmin, createAdminWorkerOrder);
router.post("/complete-worker-addition", protectAdmin, completeAdminWorkerAddition);

// Delete requests (Admin can create, Super Admin can process)
router.post("/delete-request", protectAdmin, createDeleteRequest);
router.get("/delete-requests", protectSuperAdmin, getDeleteRequests);
router.post("/process-delete-request", protectSuperAdmin, processDeleteRequest);

// Contact management (Admin & Super Admin)
router.get("/contacts", protectAdmin, getAllContacts);
router.put("/contacts/:id/resolve", protectAdmin, markContactResolved);

// Analytics (Admin & Super Admin)
router.get("/analytics", protectAdmin, getAnalytics);

// Transaction management (Admin & Super Admin)
router.get("/transactions", protectAdmin, getAllTransactions);
router.get("/transactions/summary", protectAdmin, getTransactionSummary);

// Admin management (Super Admin only)
router.post("/create-admin", protectSuperAdmin, createAdmin);
router.get("/admins", protectSuperAdmin, getAllAdmins);
router.delete("/admins/:id", protectSuperAdmin, deleteAdmin);

// Admin profile photo upload
router.post("/upload-photo", protectAdmin, uploadProfile.single("photo"), uploadAdminPhoto);

export default router;

