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

