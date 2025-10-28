import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    address: {
      type: String,
      required: true,
    },
    workerType: {
      type: String,
      required: true,
      enum: ['Domestic Worker', 'Saloon Worker', 'Rickshaw Driver', 'Auto Driver', 'Construction Worker', 'Factory Worker', 'Agricultural Worker', 'Other'],
    },
    userId: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple null values
    },
    profilePic: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
      enum: ["annual", "permanent"],
      default: "annual",
    },
    membershipExpiry: {
      type: Date,
      default: null,
    },
    paymentId: {
      type: String,
      default: "",
    },
    orderId: {
      type: String,
      default: "",
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    // Generate unique user ID if paid and not already set
    if (!this.userId && this.isPaid) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(1000 + Math.random() * 9000);
      this.userId = `AILU${timestamp}${random}`;
    }

    // Hash password if modified
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

export default User;
