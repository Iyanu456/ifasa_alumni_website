import mongoose from "mongoose";
import { applyCommonSchemaOptions } from "../utils/schema.js";

const contactMessageSchema = new mongoose.Schema(
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
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: ["new", "read", "resolved"],
      default: "new",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactMessageSchema.index({ createdAt: -1 });

applyCommonSchemaOptions(contactMessageSchema);

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;
