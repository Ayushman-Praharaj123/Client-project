import User from "../models/User.js";
import OTP from "../models/OTP.js";
import Analytics from "../models/Analytics.js";
import Transaction from "../models/Transaction.js";
import jwt from "jsonwebtoken";
import { createOrder, verifyPaymentSignature } from "../lib/payment.js";
import { sendOTPEmail, sendWelcomeEmail } from "../lib/email.js";
import { sendOTPSMS } from "../lib/sms.js";
import otpGenerator from "otp-generator";

// Create payment order for registration
export async function createRegistrationOrder(req, res) {
  try {
    const { fullName, phoneNumber, email, address, workerType, password, membershipType } = req.body;

    // Validation
    if (!fullName || !phoneNumber || !email || !address || !workerType || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or phone number already exists" });
    }

    // Determine amount based on membership type
    const amount = membershipType === "permanent" ? 1000 : 250;
    const receipt = `reg_${Date.now()}_${phoneNumber}`;
    const orderResult = await createOrder(amount, receipt);

    if (!orderResult.success) {
      return res.status(500).json({ message: "Failed to create payment order" });
    }

    res.status(200).json({
      success: true,
      order: orderResult.order,
      amount,
      membershipType: membershipType || "annual",
    });
  } catch (error) {
    console.log("Error in createRegistrationOrder controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Complete registration after payment
export async function completeRegistration(req, res) {
  try {
    const {
      fullName,
      phoneNumber,
      email,
      address,
      workerType,
      password,
      orderId,
      paymentId,
      signature,
      membershipType,
      amount,
    } = req.body;

    // Verify payment signature
    const isValid = verifyPaymentSignature(orderId, paymentId, signature);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Calculate membership expiry
    const membershipExpiry = membershipType === "permanent"
      ? null
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

    // Create user
    const newUser = await User.create({
      fullName,
      phoneNumber,
      email,
      address,
      workerType,
      password,
      isPaid: true,
      membershipType: membershipType || "annual",
      membershipExpiry,
      paymentId,
      orderId,
    });

    // Create transaction record
    await Transaction.create({
      userId: newUser._id,
      orderId,
      paymentId,
      amount: amount || (membershipType === "permanent" ? 1000 : 250),
      membershipType: membershipType || "annual",
      receipt: `reg_${Date.now()}_${phoneNumber}`,
      addedBy: "self",
      status: "completed",
    });

    // Send welcome email
    await sendWelcomeEmail(email, fullName, newUser.userId);

    // Update analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await Analytics.findOneAndUpdate(
      { date: today },
      { $inc: { registrations: 1 } },
      { upsert: true }
    );

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, role: "worker" }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        userId: newUser.userId,
        workerType: newUser.workerType,
        address: newUser.address,
        membershipType: newUser.membershipType,
        membershipExpiry: newUser.membershipExpiry,
      },
    });
  } catch (error) {
    console.log("Error in completeRegistration controller", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (error.keyPattern?.phoneNumber) {
        return res.status(400).json({ message: "Phone number already registered" });
      }
    }

    res.status(500).json({ message: "Registration failed. Please try again." });
  }
}

// Worker login
export async function login(req, res) {
  try {
    const { phoneNumber, password, loginType } = req.body;

    if (!phoneNumber || !password || !loginType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Handle admin/super admin login
    if (loginType === "admin" || loginType === "superadmin") {
      return handleAdminLogin(req, res, loginType);
    }

    // Worker login
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({ message: "Invalid phone number or password" });
    }

    if (!user.isPaid) {
      return res.status(401).json({ message: "Registration payment not completed" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid phone number or password" });
    }

    const token = jwt.sign({ userId: user._id, role: "worker" }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userId: user.userId,
        workerType: user.workerType,
        address: user.address,
      },
      role: "worker",
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Admin/Super Admin login handler
async function handleAdminLogin(req, res, loginType) {
  const { phoneNumber, password } = req.body;

  if (loginType === "superadmin") {
    // Super admin login
    if (
      phoneNumber === process.env.SUPER_ADMIN_PHONE &&
      password === process.env.SUPER_ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { phoneNumber, role: "superadmin" },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      return res.status(200).json({
        success: true,
        admin: { phoneNumber, role: "superadmin" },
        role: "superadmin",
      });
    }
  } else if (loginType === "admin") {
    // Admin login - check against multiple admin credentials
    const adminCredentials = [
      { phone: process.env.ADMIN_PHONE_1, password: process.env.ADMIN_PASSWORD_1 },
      { phone: process.env.ADMIN_PHONE_2, password: process.env.ADMIN_PASSWORD_2 },
    ];

    const validAdmin = adminCredentials.find(
      (admin) => admin.phone === phoneNumber && admin.password === password
    );

    if (validAdmin) {
      const token = jwt.sign({ phoneNumber, role: "admin" }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
      });

      res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      return res.status(200).json({
        success: true,
        admin: { phoneNumber, role: "admin" },
        role: "admin",
      });
    }
  }

  return res.status(401).json({ message: "Invalid credentials" });
}

// Logout
export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
}

// Send OTP for password reset
export async function sendPasswordResetOTP(req, res) {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Find user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Save OTP to database
    await OTP.create({
      phoneNumber,
      email: user.email,
      otp,
    });

    // Send OTP via email and SMS
    await sendOTPEmail(user.email, otp, user.fullName);
    await sendOTPSMS(phoneNumber, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email and phone number",
    });
  } catch (error) {
    console.log("Error in sendPasswordResetOTP controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Verify OTP
export async function verifyOTP(req, res) {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: "Phone number and OTP are required" });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({
      phoneNumber,
      otp,
      verified: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log("Error in verifyOTP controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Reset password
export async function resetPassword(req, res) {
  try {
    const { phoneNumber, newPassword } = req.body;

    if (!phoneNumber || !newPassword) {
      return res.status(400).json({ message: "Phone number and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if OTP was verified
    const verifiedOTP = await OTP.findOne({
      phoneNumber,
      verified: true,
      expiresAt: { $gt: new Date() },
    });

    if (!verifiedOTP) {
      return res.status(400).json({ message: "Please verify OTP first" });
    }

    // Find user and update password
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    // Delete used OTP
    await OTP.deleteMany({ phoneNumber });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error in resetPassword controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
