import mongoose from "mongoose";
import User from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import { USER_ROLES } from "../utils/roles.js";
import { listDocuments } from "./query.service.js";
import { logActivity } from "./activity.service.js";

const findUserById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid user identifier.", "INVALID_IDENTIFIER");
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found.", "USER_NOT_FOUND");
  }

  return user;
};

const buildUsersFilter = (query = {}) => {
  const filter = {};

  if (query.role) {
    filter.role = query.role;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.authProvider) {
    filter.authProvider = query.authProvider;
  }

  if (query.isVerified !== undefined) {
    filter.isVerified = query.isVerified === "true";
  }

  if (query.isProfileComplete !== undefined) {
    filter.isProfileComplete = query.isProfileComplete === "true";
  }

  return filter;
};

export const listUsersForAdmin = async (query) =>
  listDocuments({
    model: User,
    query,
    filter: buildUsersFilter(query),
    searchFields: [
      "fullName",
      "email",
      "currentRole",
      "company",
      "location",
      "specialization",
    ],
    allowedSortFields: [
      "fullName",
      "email",
      "role",
      "status",
      "graduationYear",
      "createdAt",
      "updatedAt",
      "lastLoginAt",
    ],
    defaultSortField: "createdAt",
    defaultOrder: "desc",
  });

export const getUserForAdmin = async (id) => findUserById(id);

export const makeUserAdmin = async (id, actor) => {
  const user = await findUserById(id);

  if (user.role !== USER_ROLES.ADMIN) {
    user.role = USER_ROLES.ADMIN;
    user.status = "approved";
    await user.save();

    await logActivity({
      actor,
      action: "admin.user-promoted",
      entityType: "user",
      entityId: user._id,
      targetName: user.fullName,
      description: "User promoted to administrator.",
    });
  }

  return user;
};

export const removeUserAdminRole = async (id, actor) => {
  const user = await findUserById(id);

  if (user.role !== USER_ROLES.ADMIN) {
    return user;
  }

  const adminCount = await User.countDocuments({ role: USER_ROLES.ADMIN });

  if (adminCount <= 1) {
    throw new ApiError(
      400,
      "At least one administrator must remain on the platform.",
      "LAST_ADMIN_PROTECTED",
    );
  }

  user.role = USER_ROLES.USER;
  await user.save();

  await logActivity({
    actor,
    action: "admin.user-demoted",
    entityType: "user",
    entityId: user._id,
    targetName: user.fullName,
    description: "Administrator role removed from user.",
  });

  return user;
};
