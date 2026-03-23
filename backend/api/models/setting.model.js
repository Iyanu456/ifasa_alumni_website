import mongoose from "mongoose";
import { applyCommonSchemaOptions } from "../utils/schema.js";

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "global",
      unique: true,
      trim: true,
    },
    siteName: {
      type: String,
      default: "IFASA Architecture Alumni",
      trim: true,
      maxlength: 160,
    },
    siteDescription: {
      type: String,
      default: "A community of architects shaping the future.",
      trim: true,
      maxlength: 500,
    },
    contactEmail: {
      type: String,
      default: "alumni.ife@oau.edu.ng",
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      default: "+234 800 000 0000",
      trim: true,
      maxlength: 30,
    },
    contactAddress: {
      type: String,
      default: "OAU Campus, Ile-Ife",
      trim: true,
      maxlength: 200,
    },
    socialLinks: {
      instagram: {
        type: String,
        trim: true,
        default: "",
      },
      linkedin: {
        type: String,
        trim: true,
        default: "",
      },
      twitter: {
        type: String,
        trim: true,
        default: "",
      },
    },
    donationLink: {
      type: String,
      trim: true,
      default: "",
    },
    allowRegistrations: {
      type: Boolean,
      default: true,
    },
    enableDonations: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

applyCommonSchemaOptions(settingSchema);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
