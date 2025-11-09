import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

// Get user profile
export async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in getUserProfile controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update user profile
export async function updateUserProfile(req, res) {
  try {
    const { fullName, email, phoneNumber, address } = req.body;

    // Check if email or phone is already taken by another user
    if (email || phoneNumber) {
      const existingUser = await User.findOne({
        $or: [
          email ? { email } : {},
          phoneNumber ? { phoneNumber } : {},
        ],
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email or phone number already in use by another user",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(fullName && { fullName }),
        ...(email && { email }),
        ...(phoneNumber && { phoneNumber }),
        ...(address && { address }),
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("Error in updateUserProfile controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get all registered members (for homepage carousel)
export async function getAllMembers(req, res) {
  try {
    const members = await User.find({ isPaid: true })
      .select("fullName location profilePic workerType")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, members });
  } catch (error) {
    console.log("Error in getAllMembers controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Upload profile photo
export async function uploadProfilePhoto(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile picture path
    user.profilePic = `/uploads/profiles/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      profilePic: user.profilePic,
      message: "Profile photo uploaded successfully",
    });
  } catch (error) {
    console.log("Error in uploadProfilePhoto controller", error);
    res.status(500).json({ message: "Failed to upload photo" });
  }
}

// Get user transaction
export async function getUserTransaction(req, res) {
  try {
    const transaction = await Transaction.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });

    if (!transaction) {
      return res.status(404).json({ message: "No transaction found" });
    }

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    console.log("Error in getUserTransaction controller", error);
    res.status(500).json({ message: "Failed to fetch transaction" });
  }
}

// Add email to user profile
export async function addEmail(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email is already taken
    const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = email;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email added successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.log("Error in addEmail controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Set password (for users who registered with OTP)
export async function setPassword(req, res) {
  try {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Password and confirm password are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.hasPassword) {
      return res.status(400).json({ message: "Password already set. Use change password instead." });
    }

    user.password = password;
    user.hasPassword = true;
    user.registrationMethod = "password";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password set successfully",
    });
  } catch (error) {
    console.log("Error in setPassword controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Change password (no OTP required)
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.hasPassword || !user.password) {
      return res.status(400).json({ message: "No password set. Use set password instead." });
    }

    // Verify current password
    const isPasswordCorrect = await user.matchPassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Error in changePassword controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Download ID Card (accessible via email link)
export async function downloadIdCard(req, res) {
  try {
    const { userId } = req.params;

    // Find user by userId (not MongoDB _id)
    const user = await User.findOne({ userId }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data for ID card generation (frontend will handle PDF generation)
    res.status(200).json({
      success: true,
      user: {
        userId: user.userId,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        address: user.address,
        workerType: user.workerType,
        membershipType: user.membershipType,
        membershipStartDate: user.membershipStartDate,
        membershipExpiry: user.membershipExpiry,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.log("Error in downloadIdCard controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Download Receipt (accessible via email link)
export async function downloadReceipt(req, res) {
  try {
    const { userId } = req.params;

    // Find user by userId
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the latest transaction for this user
    const transaction = await Transaction.findOne({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!transaction) {
      return res.status(404).json({ message: "No transaction found" });
    }

    // Return transaction data for receipt generation
    res.status(200).json({
      success: true,
      transaction: {
        orderId: transaction.orderId,
        paymentId: transaction.paymentId,
        amount: transaction.amount,
        membershipType: transaction.membershipType,
        status: transaction.status,
        createdAt: transaction.createdAt,
      },
      user: {
        userId: user.userId,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        address: user.address,
      },
    });
  } catch (error) {
    console.log("Error in downloadReceipt controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

