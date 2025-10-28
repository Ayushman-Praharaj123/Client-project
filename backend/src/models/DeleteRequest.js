import mongoose from "mongoose";

const deleteRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedBy: {
      type: String, // Admin phone number
      required: true,
    },
    reason: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    processedBy: {
      type: String, // Super admin phone number
      default: "",
    },
    processedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const DeleteRequest = mongoose.model("DeleteRequest", deleteRequestSchema);

export default DeleteRequest;

