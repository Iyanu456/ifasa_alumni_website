import mongoose from "mongoose";
import { applyCommonSchemaOptions } from "../utils/schema.js";

const activityLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    actorName: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    entityType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    targetName: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
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

activityLogSchema.index({ createdAt: -1 });

applyCommonSchemaOptions(activityLogSchema);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
