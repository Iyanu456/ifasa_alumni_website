import mongoose from "mongoose";
import { applyCommonSchemaOptions } from "../utils/schema.js";

const eventSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: [
        "Networking",
        "Workshop",
        "Conference",
        "Meetup",
        "Seminar",
        "Talk",
        "Reunion",
        "Other",
      ],
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    coverImageUrl: {
      type: String,
      trim: true,
    },
    registrationLink: {
      type: String,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
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

applyCommonSchemaOptions(eventSchema);

const Event = mongoose.model("Event", eventSchema);

export default Event;
