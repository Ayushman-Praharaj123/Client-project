import User from "../models/User.js";
import Admin from "../models/Admin.js";
import DeleteRequest from "../models/DeleteRequest.js";
import Contact from "../models/Contact.js";
import Analytics from "../models/Analytics.js";
import Transaction from "../models/Transaction.js";
import { createOrder, verifyPaymentSignature } from "../lib/payment.js";

// Get all users (Admin & Super Admin)
export async function getAllUsers(req, res) {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    let query = { isPaid: true };

    // Search functionality
    if (search) {
      query = {
        ...query,
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phoneNumber: { $regex: search, $options: "i" } },
          { userId: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.log("Error in getAllUsers controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get user by ID (Admin & Super Admin)
export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in getUserById controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update user details (Admin & Super Admin)
export async function updateUser(req, res) {
  try {
    const { fullName, email, phoneNumber, address, workerType } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...(fullName && { fullName }),
        ...(email && { email }),
        ...(phoneNumber && { phoneNumber }),
        ...(address && { address }),
        ...(workerType && { workerType }),
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("Error in updateUser controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Create delete request (Admin only)
export async function createDeleteRequest(req, res) {
  try {
    const { userId, reason } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if delete request already exists
    const existingRequest = await DeleteRequest.findOne({
      userId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Delete request already pending for this user" });
    }

    const deleteRequest = await DeleteRequest.create({
      userId,
      requestedBy: req.admin.phoneNumber,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Delete request sent to super admin",
      deleteRequest,
    });
  } catch (error) {
    console.log("Error in createDeleteRequest controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get all delete requests (Super Admin only)
export async function getDeleteRequests(req, res) {
  try {
    const { status = "pending" } = req.query;

    const deleteRequests = await DeleteRequest.find({ status })
      .populate("userId", "fullName email phoneNumber userId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, deleteRequests });
  } catch (error) {
    console.log("Error in getDeleteRequests controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Process delete request (Super Admin only)
export async function processDeleteRequest(req, res) {
  try {
    const { requestId, action } = req.body; // action: 'approve' or 'reject'

    if (!requestId || !action) {
      return res.status(400).json({ message: "Request ID and action are required" });
    }

    const deleteRequest = await DeleteRequest.findById(requestId);
    if (!deleteRequest) {
      return res.status(404).json({ message: "Delete request not found" });
    }

    if (deleteRequest.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    if (action === "approve") {
      // Delete the user
      await User.findByIdAndDelete(deleteRequest.userId);
      deleteRequest.status = "approved";
    } else if (action === "reject") {
      deleteRequest.status = "rejected";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    deleteRequest.processedBy = req.admin.phoneNumber;
    deleteRequest.processedAt = new Date();
    await deleteRequest.save();

    res.status(200).json({
      success: true,
      message: `Delete request ${action}d successfully`,
      deleteRequest,
    });
  } catch (error) {
    console.log("Error in processDeleteRequest controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get all contacts (Admin & Super Admin)
export async function getAllContacts(req, res) {
  try {
    const { isResolved } = req.query;

    let query = {};
    if (isResolved !== undefined) {
      query.isResolved = isResolved === "true";
    }

    const contacts = await Contact.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, contacts });
  } catch (error) {
    console.log("Error in getAllContacts controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Mark contact as resolved (Admin & Super Admin)
export async function markContactResolved(req, res) {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isResolved: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ success: true, contact });
  } catch (error) {
    console.log("Error in markContactResolved controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get analytics data (Admin & Super Admin)
export async function getAnalytics(req, res) {
  try {
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const analytics = await Analytics.find({
      date: { $gte: startDate },
    }).sort({ date: 1 });

    // Get total users count
    const totalUsers = await User.countDocuments({ isPaid: true });

    // Get total contacts
    const totalContacts = await Contact.countDocuments();
    const unresolvedContacts = await Contact.countDocuments({ isResolved: false });

    res.status(200).json({
      success: true,
      analytics,
      summary: {
        totalUsers,
        totalContacts,
        unresolvedContacts,
      },
    });
  } catch (error) {
    console.log("Error in getAnalytics controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Create payment order for admin-added worker
export async function createAdminWorkerOrder(req, res) {
  try {
    const { fullName, phoneNumber, email, membershipType } = req.body;

    // Validation
    if (!fullName || !phoneNumber || !email) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or phone number already exists" });
    }

    // Determine amount based on membership type
    const membershipFees = {
      monthly: 150,
      quarterly: 250,
      halfyearly: 350,
      yearly: 650,
    };
    const amount = membershipFees[membershipType] || 150;
    const receipt = `admin_${Date.now()}_${phoneNumber}`;
    const orderResult = await createOrder(amount, receipt);

    if (!orderResult.success) {
      return res.status(500).json({ message: "Failed to create payment order" });
    }

    res.status(200).json({
      success: true,
      order: orderResult.order,
      amount,
      membershipType: membershipType || "monthly",
    });
  } catch (error) {
    console.log("Error in createAdminWorkerOrder controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Complete worker addition after payment (Admin only)
export async function completeAdminWorkerAddition(req, res) {
  try {
    const {
      fullName,
      phoneNumber,
      email,
      address,
      workerType,
      password,
      membershipType,
      amount,
      orderId,
      paymentId,
      signature
    } = req.body;

    // Validation
    if (!fullName || !phoneNumber || !email || !address || !workerType || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: "Payment details missing" });
    }

    // Verify payment signature
    const isValid = verifyPaymentSignature(orderId, paymentId, signature);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Check if user already exists (double-check)
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or phone number already exists" });
    }

    // Calculate membership expiry based on plan
    const membershipDurations = {
      monthly: 30,
      quarterly: 90,
      halfyearly: 180,
      yearly: 365,
    };

    const membershipFees = {
      monthly: 150,
      quarterly: 250,
      halfyearly: 350,
      yearly: 650,
    };

    const durationDays = membershipDurations[membershipType] || 30;
    const membershipStartDate = new Date();
    const membershipExpiry = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    // Create user with payment
    const newUser = await User.create({
      fullName,
      phoneNumber,
      email,
      address,
      workerType,
      password,
      isPaid: true,
      membershipType: membershipType || "monthly",
      membershipFee: membershipFees[membershipType] || 150,
      membershipStartDate,
      membershipExpiry,
      paymentId,
      orderId,
    });

    // Create transaction record with admin info
    await Transaction.create({
      userId: newUser._id,
      orderId,
      paymentId,
      amount: amount || membershipFees[membershipType] || 150,
      membershipType: membershipType || "monthly",
      receipt: `admin_${Date.now()}_${phoneNumber}`,
      addedBy: `admin_${req.admin.phoneNumber}`, // Track which admin added this worker
      status: "completed",
    });

    // Update analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await Analytics.findOneAndUpdate(
      { date: today },
      { $inc: { registrations: 1 } },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: "Worker added successfully with payment",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        userId: newUser.userId,
        membershipType: newUser.membershipType,
      },
    });
  } catch (error) {
    console.log("Error in completeAdminWorkerAddition controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get all transactions (Admin & Super Admin)
export async function getAllTransactions(req, res) {
  try {
    const { search, membershipType, startDate, endDate, page = 1, limit = 50 } = req.query;

    let query = {};

    // Filter by membership type
    if (membershipType && membershipType !== "all") {
      query.membershipType = membershipType;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) {
        query.paymentDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.paymentDate.$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(query)
      .populate("userId", "fullName email phoneNumber userId workerType")
      .sort({ paymentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.log("Error in getAllTransactions controller", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
}

// Get transaction summary (Admin & Super Admin)
export async function getTransactionSummary(req, res) {
  try {
    // Total fees collected
    const totalResult = await Transaction.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    // Fees by membership type
    const byMembershipType = await Transaction.aggregate([
      {
        $group: {
          _id: "$membershipType",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Fees by added by (self vs admin)
    const byAddedBy = await Transaction.aggregate([
      {
        $group: {
          _id: "$addedBy",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Monthly breakdown (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyBreakdown = await Transaction.aggregate([
      { $match: { paymentDate: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$paymentDate" },
            month: { $month: "$paymentDate" },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      success: true,
      summary: {
        totalFees: totalResult[0]?.totalAmount || 0,
        totalTransactions: await Transaction.countDocuments(),
        byMembershipType,
        byAddedBy,
        monthlyBreakdown,
      },
    });
  } catch (error) {
    console.log("Error in getTransactionSummary controller", error);
    res.status(500).json({ message: "Failed to get summary" });
  }
}

// Upload admin profile photo
export async function uploadAdminPhoto(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update profile picture path
    admin.profilePic = `/uploads/profiles/${req.file.filename}`;
    await admin.save();

    res.status(200).json({
      success: true,
      profilePic: admin.profilePic,
      message: "Profile photo uploaded successfully",
    });
  } catch (error) {
    console.log("Error in uploadAdminPhoto controller", error);
    res.status(500).json({ message: "Failed to upload photo" });
  }
}

// Create new admin (Super Admin only)
export async function createAdmin(req, res) {
  try {
    const { name, phoneNumber, password, confirmPassword } = req.body;

    // Validation
    if (!name || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Please enter a valid 10-digit phone number" });
    }

    // Check if admin with this phone number already exists
    const existingAdmin = await Admin.findOne({ phoneNumber });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this phone number already exists" });
    }

    // Create new admin
    const newAdmin = await Admin.create({
      name,
      phoneNumber,
      password,
      role: "admin",
      createdBy: req.admin.phoneNumber, // Super admin's phone number
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        _id: newAdmin._id,
        name: newAdmin.name,
        phoneNumber: newAdmin.phoneNumber,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.log("Error in createAdmin controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get all admins (Super Admin only)
export async function getAllAdmins(req, res) {
  try {
    const admins = await Admin.find({ role: "admin" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      admins,
    });
  } catch (error) {
    console.log("Error in getAllAdmins controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete admin (Super Admin only)
export async function deleteAdmin(req, res) {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.role === "superadmin") {
      return res.status(403).json({ message: "Cannot delete super admin" });
    }

    await Admin.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteAdmin controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

