import mongoose from "mongoose";
import { applyCommonSchemaOptions } from "../utils/schema.js";

const executiveSchema = new mongoose.Schema(
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
      maxlength: 160,
    },
    profilePicture: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      //required: true,
      trim: true,
      maxlength: 120,
    },
    position: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    title: {
      type: String,
      //required: true,
      trim: true,
      maxlength: 160,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

executiveSchema.index({ sortOrder: 1, createdAt: -1 });

applyCommonSchemaOptions(executiveSchema);

const Executive = mongoose.model("Executive", executiveSchema);

export default Executive;
