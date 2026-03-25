import mongoose from "mongoose";
import { applyCommonSchemaOptions } from "../utils/schema.js";

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    category: {
      type: String,
      enum: [
        "Job",
        "Internship",
        "Scholarship",
        "Grant",
        "Fellowship",
        "Competition",
        "Other",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    requirements: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    deadline: {
      type: Date,
      index: true,
    },
    applicationLink: {
      type: String,
      trim: true,
    },
    coverImageUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

applyCommonSchemaOptions(opportunitySchema);

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

export default Opportunity;
