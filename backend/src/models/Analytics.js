import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    visits: {
      type: Number,
      default: 0,
    },
    registrations: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;

