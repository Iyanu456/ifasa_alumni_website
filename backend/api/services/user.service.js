import mongoose from "mongoose";
import User from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import { REGULAR_USER_ROLES, USER_ROLES } from "../utils/roles.js";
import { listDocuments } from "./query.service.js";
import { logActivity } from "./activity.service.js";
import { deleteLocalFileByUrl } from "../utils/file.js";

import env from "../config/env.js"; // adjust path if needed

const buildAlumniFilter = ({ adminView = false, query = {} }) => {
  const filter = {
    role: { $in: REGULAR_USER_ROLES },
  };

  // ✅ Exclude only the super admin
  if (env.adminEmail) {
    filter.email = { $ne: env.adminEmail };
  }

  // 🔥 Public view: flexible visibility
  if (!adminView) {
    filter.$or = [
      { status: "approved" },
      { isVerified: true },
      { isProfileComplete: true },
    ];
  }

  // Optional filters
  if (adminView && query.status) {
    filter.status = query.status;
  }

  if (query.graduationYear && query.graduationYear !== "All") {
    filter.graduationYear = query.graduationYear;
  }

  if (adminView && query.isVerified !== undefined) {
    filter.isVerified =
      query.isVerified === true || query.isVerified === "true";
  }

  if (adminView && query.isProfileComplete !== undefined) {
    filter.isProfileComplete =
      query.isProfileComplete === true ||
      query.isProfileComplete === "true";
  }

  return filter;
};

export const listPublicAlumni = async (query) =>
  listDocuments({
    model: User,
    query,
    filter: buildAlumniFilter({ query }),
    searchFields: ["fullName", "currentRole", "location", "specialization"],
    allowedSortFields: ["fullName", "graduationYear", "createdAt"],
    defaultSortField: "createdAt",
    defaultOrder: "desc",
  });

export const listAdminAlumni = async (query) =>
  listDocuments({
    model: User,
    query,
    filter: buildAlumniFilter({ adminView: true, query }),
    searchFields: [
      "fullName",
      "currentRole",
      "location",
      "specialization",
      "email",
    ],
    allowedSortFields: ["fullName", "graduationYear", "createdAt", "updatedAt"],
    defaultSortField: "createdAt",
    defaultOrder: "desc",
  });

export const listExecutiveAlumni = async () =>
  User.find({
    role: { $in: REGULAR_USER_ROLES },
    status: "approved",
    isVerified: true,
    isProfileComplete: true,
    associationRoleTitle: { $exists: true, $ne: "" },
  })
    .sort({ updatedAt: -1, fullName: 1 })
    .limit(12)
    .lean();

const findAlumnus = async (id, adminView = false) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid alumni identifier.", "INVALID_IDENTIFIER");
  }

  const filter = {
    _id: id,
    role: { $in: REGULAR_USER_ROLES },
  };

  if (!adminView) {
    filter.status = "approved";
    filter.isVerified = true;
    filter.isProfileComplete = true;
  }

  const alumnus = await User.findOne(filter);

  if (!alumnus) {
    throw new ApiError(404, "Alumnus not found.", "RESOURCE_NOT_FOUND");
  }

  return alumnus;
};

export const getPublicAlumnus = async (id) => findAlumnus(id, false);

export const getAdminAlumnus = async (id) => findAlumnus(id, true);

export const createAlumnus = async (payload, actor) => {
  const email = payload.email.toLowerCase().trim();
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists.", "USER_EXISTS");
  }

  const alumnus = await User.create({
    ...payload,
    email,
    role: USER_ROLES.USER,
    authProvider: "local",
    isVerified: true,
    isProfileComplete: true,
    status: payload.status || "approved",
    consent: payload.consent ?? true,
  });

  await logActivity({
    actor,
    action: "alumni.created",
    entityType: "user",
    entityId: alumnus._id,
    targetName: alumnus.fullName,
    description: "Alumni profile created by admin.",
  });

  return alumnus;
};

export const approveAlumnus = async (id, actor) => {
  const alumnus = await findAlumnus(id, true);
  alumnus.status = "approved";
  await alumnus.save();

  await logActivity({
    actor,
    action: "alumni.approved",
    entityType: "user",
    entityId: alumnus._id,
    targetName: alumnus.fullName,
    description: "Alumni profile approved.",
  });

  return alumnus;
};

export const updateAlumnus = async (id, payload, actor) => {
  const alumnus = await findAlumnus(id, true);

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      alumnus[key] = value;
    }
  });

  await alumnus.save();

  await logActivity({
    actor,
    action: "alumni.updated",
    entityType: "user",
    entityId: alumnus._id,
    targetName: alumnus.fullName,
    description: "Alumni profile updated.",
  });

  return alumnus;
};

export const deleteAlumnus = async (id, actor) => {
  const alumnus = await findAlumnus(id, true);
  await alumnus.deleteOne();

  await logActivity({
    actor,
    action: "alumni.deleted",
    entityType: "user",
    entityId: alumnus._id,
    targetName: alumnus.fullName,
    description: "Alumni profile deleted.",
  });

  return alumnus;
};

export const getOwnProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.", "USER_NOT_FOUND");
  }

  return user;
};

export const upsertOwnProfile = async (userId, payload, actor) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.", "USER_NOT_FOUND");
  }

  if (payload.avatarUrl && user.avatarUrl && payload.avatarUrl !== user.avatarUrl) {
    await deleteLocalFileByUrl(user.avatarUrl);
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      user[key] = value;
    }
  });

  user.isProfileComplete = true;

  await user.save();

  await logActivity({
    actor,
    action: "users.profile-updated",
    entityType: "user",
    entityId: user._id,
    targetName: user.fullName,
    description: "User completed or updated their profile.",
  });

  return user;
};
