import User from "../models/User.js";
import OTP from "../models/OTP.js";
import Analytics from "../models/Analytics.js";
import Transaction from "../models/Transaction.js";
import jwt from "jsonwebtoken";
import { createOrder, verifyPaymentSignature } from "../lib/payment.js";
import { sendOTPEmail, sendWelcomeEmail } from "../lib/email.js";
import otpGenerator from "otp-generator";

// Create payment order for registration
export async function createRegistrationOrder(req, res) {
  try {
    const { fullName, phoneNumber, email, address, workerType, password, membershipType, registrationMethod } = req.body;

    // Validation
    if (!fullName || !phoneNumber || !address || !workerType) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Validate registration method
    if (!registrationMethod || !["password", "otp"].includes(registrationMethod)) {
      return res.status(400).json({ message: "Invalid registration method" });
    }

    // If email is provided, must use OTP method
    if (email && registrationMethod !== "otp") {
      return res.status(400).json({ message: "Email registration requires OTP verification" });
    }

    // If no email, must use password method
    if (!email && registrationMethod !== "password") {
      return res.status(400).json({ message: "Registration without email requires password" });
    }

    // Password validation for password-based registration
    if (registrationMethod === "password") {
      if (!password) {
        return res.status(400).json({ message: "Password is required for password-based registration" });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
    }

    // Email validation for OTP-based registration
    if (registrationMethod === "otp") {
      if (!email) {
        return res.status(400).json({ message: "Email is required for OTP-based registration" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User with this phone number already exists" });
    }

    // Check email if provided
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
    }

    // Determine amount based on membership type
    const membershipFees = {
      monthly: 150,
      quarterly: 250,
      halfyearly: 350,
      yearly: 650,
    };

    const amount = membershipFees[membershipType] || 150;
    const receipt = `reg_${Date.now()}_${phoneNumber}`;
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
      registrationMethod,
    } = req.body;

    // Verify payment signature
    const isValid = verifyPaymentSignature(orderId, paymentId, signature);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
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

    // Create user
    const newUser = await User.create({
      fullName,
      phoneNumber,
      email: email || null,
      address,
      workerType,
      password: password || null,
      registrationMethod: registrationMethod || "password",
      hasPassword: password ? true : false,
      isPaid: true,
      membershipType: membershipType || "monthly",
      membershipFee: membershipFees[membershipType] || 150,
      membershipStartDate,
      membershipExpiry,
      paymentId,
      orderId,
    });

    // Create transaction record
    await Transaction.create({
      userId: newUser._id,
      orderId,
      paymentId,
      amount: amount || membershipFees[membershipType] || 150,
      membershipType: membershipType || "monthly",
      receipt: `reg_${Date.now()}_${phoneNumber}`,
      addedBy: "self",
      status: "completed",
    });

    // Send welcome email only if email is provided
    if (email) {
      await sendWelcomeEmail(
        email,
        fullName,
        newUser.userId,
        newUser.membershipType,
        newUser.membershipExpiry
      );
    }

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

// Worker login (password-based)
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

    // Check if user has password
    if (!user.hasPassword || !user.password) {
      return res.status(401).json({ message: "This account was registered with email OTP. Please login using OTP." });
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

// Admin/Super Admin login handler (using environment variables)
async function handleAdminLogin(req, res, loginType) {
  const { phoneNumber, password } = req.body;

  try {
    let isValid = false;
    let adminName = "";
    let adminRole = "";

    if (loginType === "admin") {
      // Check Admin 1
      if (
        phoneNumber === process.env.ADMIN_PHONE_1 &&
        password === process.env.ADMIN_PASSWORD_1
      ) {
        isValid = true;
        adminName = "John";
        adminRole = "admin";
      }
      // Check Admin 2
      else if (
        phoneNumber === process.env.ADMIN_PHONE_2 &&
        password === process.env.ADMIN_PASSWORD_2
      ) {
        isValid = true;
        adminName = "Quinta";
        adminRole = "admin";
      }
    } else if (loginType === "superadmin") {
      // Check Super Admin
      if (
        phoneNumber === process.env.SUPER_ADMIN_PHONE &&
        password === process.env.SUPER_ADMIN_PASSWORD
      ) {
        isValid = true;
        adminName = "Steve";
        adminRole = "superadmin";
      }
    }

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        phoneNumber,
        name: adminName,
        role: adminRole
      },
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
      admin: {
        name: adminName,
        phoneNumber,
        role: adminRole,
        profilePic: "",
      },
      role: adminRole,
    });
  } catch (error) {
    console.log("Error in handleAdminLogin", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
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

    // Check if user has email
    if (!user.email) {
      return res.status(400).json({ message: "No email associated with this account. Please contact support." });
    }

    // Save OTP to database
    await OTP.create({
      phoneNumber,
      email: user.email,
      otp,
    });

    // Send OTP via email only
    await sendOTPEmail(user.email, otp, user.fullName, "password-reset");

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
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

// Send OTP for registration (OTP-based registration - email required)
export async function sendRegistrationOTP(req, res) {
  try {
    const { phoneNumber, email } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required for OTP-based registration" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User with this phone number already exists" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "User with this email already exists" });
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
      email,
      otp,
    });

    // Send OTP via email only
    await sendOTPEmail(email, otp, "User", "registration");

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.log("Error in sendRegistrationOTP controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Send OTP for login (OTP-based login - only phone number required)
export async function sendLoginOTP(req, res) {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Find user by phone number
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isPaid) {
      return res.status(401).json({ message: "Registration payment not completed" });
    }

    // Check if user has email linked to account
    if (!user.email) {
      return res.status(400).json({
        message: "No email linked to this account. Please login with password or add an email to your profile."
      });
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

    // Send OTP to the email linked with this phone number
    await sendOTPEmail(user.email, otp, user.fullName, "login");

    // Return masked email for user confirmation
    const maskedEmail = user.email.replace(/(.{2})(.*)(@.*)/, (match, start, middle, end) => {
      return start + '*'.repeat(middle.length) + end;
    });

    res.status(200).json({
      success: true,
      message: `OTP sent to your linked email: ${maskedEmail}`,
      email: maskedEmail,
    });
  } catch (error) {
    console.log("Error in sendLoginOTP controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Login with OTP
export async function loginWithOTP(req, res) {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: "Phone number and OTP are required" });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({
      phoneNumber,
      otp,
      verified: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Find user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isPaid) {
      return res.status(401).json({ message: "Registration payment not completed" });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Delete used OTP
    await OTP.deleteMany({ phoneNumber });

    // Create JWT token
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
    console.log("Error in loginWithOTP controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Create renewal order
export async function createRenewalOrder(req, res) {
  try {
    const { membershipType } = req.body;
    const userId = req.user._id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Determine amount based on membership type
    const membershipFees = {
      monthly: 150,
      quarterly: 250,
      halfyearly: 350,
      yearly: 650,
    };

    const amount = membershipFees[membershipType] || 150;
    const receipt = `renewal_${Date.now()}_${user.phoneNumber}`;
    const orderResult = await createOrder(amount, receipt);

    if (!orderResult.success) {
      return res.status(500).json({ message: "Failed to create payment order" });
    }

    res.status(200).json({
      success: true,
      order: orderResult.order,
      amount,
      membershipType,
    });
  } catch (error) {
    console.log("Error in createRenewalOrder controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Complete membership renewal
export async function completeRenewal(req, res) {
  try {
    const {
      membershipType,
      amount,
      orderId,
      paymentId,
      signature,
    } = req.body;

    const userId = req.user._id;

    // Verify payment signature
    const isValid = verifyPaymentSignature(orderId, paymentId, signature);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate new membership expiry
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

    // If current membership is expired, start from now, otherwise extend from expiry date
    const currentExpiry = user.membershipExpiry && new Date(user.membershipExpiry) > new Date()
      ? new Date(user.membershipExpiry)
      : new Date();

    const newExpiry = new Date(currentExpiry.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // Update user membership
    user.membershipType = membershipType;
    user.membershipFee = membershipFees[membershipType];
    user.membershipExpiry = newExpiry;
    user.isPaid = true;
    await user.save();

    // Create transaction record
    await Transaction.create({
      userId: user._id,
      orderId,
      paymentId,
      amount,
      membershipType,
      receipt: `renewal_${Date.now()}_${user.phoneNumber}`,
      addedBy: "self",
      status: "completed",
    });

    res.status(200).json({
      success: true,
      message: "Membership renewed successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userId: user.userId,
        workerType: user.workerType,
        address: user.address,
        membershipType: user.membershipType,
        membershipExpiry: user.membershipExpiry,
      },
    });
  } catch (error) {
    console.log("Error in completeRenewal controller", error);
    res.status(500).json({ message: "Renewal failed. Please try again." });
  }
}
