import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import env from "../config/env.js";
import { isRegularUserRole } from "../utils/roles.js";
import { applyCommonSchemaOptions } from "../utils/schema.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required() {
        return this.isProfileComplete;
      },
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required() {
        return this.authProvider === "local";
      },
      minlength: 8,
      select: false,
    },
    phone: {
      type: String,
      required() {
        return this.isProfileComplete;
      },
      trim: true,
      maxlength: 30,
    },
    graduationYear: {
      type: String,
      required() {
        return this.isProfileComplete;
      },
      trim: true,
      maxlength: 40,
    },
    degree: {
      type: String,
      required() {
        return this.isProfileComplete;
      },
      trim: true,
      maxlength: 120,
    },
    specialization: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    currentRole: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "alumnus"],
      default: "user",
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
      index: true,
    },
    associationRoleTitle: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationTokenHash: {
      type: String,
      select: false,
    },
    verificationTokenExpiresAt: {
      type: Date,
      select: false,
    },
    passwordResetTokenHash: {
      type: String,
      select: false,
    },
    passwordResetTokenExpiresAt: {
      type: Date,
      select: false,
    },
    consent: {
      type: Boolean,
      required() {
        return isRegularUserRole(this.role) && this.isProfileComplete;
      },
      default: false,
    },
    consentAcceptedAt: {
      type: Date,
    },
    isMentorAvailable: {
      type: Boolean,
      default: false,
    },
    isSpotlight: {
      type: Boolean,
      default: false,
    },
    spotlightQuote: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.password || !this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, env.bcryptSaltRounds);
  return next();
});

userSchema.pre("save", function syncConsentTimestamp(next) {
  if (this.isModified("consent")) {
    this.consentAcceptedAt = this.consent ? new Date() : undefined;
  }

  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ fullName: 1, graduationYear: 1 });

applyCommonSchemaOptions(userSchema, [
  "password",
  "verificationTokenHash",
  "verificationTokenExpiresAt",
  "passwordResetTokenHash",
  "passwordResetTokenExpiresAt",
]);

const User = mongoose.model("User", userSchema);

export default User;
