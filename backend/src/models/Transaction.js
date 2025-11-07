import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    membershipType: {
      type: String,
      enum: ["monthly", "quarterly", "halfyearly", "yearly"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    paymentMethod: {
      type: String,
      default: "razorpay",
    },
    receipt: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String, // "self" or admin/superadmin phone number
      default: "self",
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ orderId: 1 }, { unique: true });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;

