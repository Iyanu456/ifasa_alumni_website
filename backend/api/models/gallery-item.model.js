import mongoose from "mongoose";
import { applyCommonSchemaOptions } from "../utils/schema.js";

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      enum: ["Events", "Reunions", "Campus", "Workshops", "Other"],
      default: "Events",
      index: true,
    },
    capturedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

applyCommonSchemaOptions(galleryItemSchema);

const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);

export default GalleryItem;
