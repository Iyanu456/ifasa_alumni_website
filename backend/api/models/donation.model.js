import mongoose from "mongoose";
import { applyCommonSchemaOptions } from "../utils/schema.js";

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "Anonymous Donor",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      default: "NGN",
      uppercase: true,
      maxlength: 3,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["manual-link", "bank-transfer", "direct"],
      default: "manual-link",
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    paidAt: {
      type: Date,
    },
    donorUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

donationSchema.index({ createdAt: -1 });

applyCommonSchemaOptions(donationSchema);

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
