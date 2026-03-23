import mongoose from "mongoose";
import { applyCommonSchemaOptions } from "../utils/schema.js";

const sponsorshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    organization: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

applyCommonSchemaOptions(sponsorshipSchema);

const Sponsorship = mongoose.model("Sponsorship", sponsorshipSchema);

export default Sponsorship;
