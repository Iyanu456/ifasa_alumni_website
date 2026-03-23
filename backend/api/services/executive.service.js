import mongoose from "mongoose";
import Executive from "../models/executive.model.js";
import ApiError from "../utils/api-error.js";
import { deleteLocalFileByUrl } from "../utils/file.js";
import { listDocuments } from "./query.service.js";
import { logActivity } from "./activity.service.js";

const findExecutive = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid executive identifier.", "INVALID_IDENTIFIER");
  }

  const executive = await Executive.findById(id);

  if (!executive) {
    throw new ApiError(404, "Executive not found.", "RESOURCE_NOT_FOUND");
  }

  return executive;
};

export const listPublicExecutives = async () =>
  Executive.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();

export const listAdminExecutives = async (query) =>
  listDocuments({
    model: Executive,
    query,
    filter:
      query.isPublished === undefined
        ? {}
        : { isPublished: query.isPublished === "true" },
    searchFields: ["name", "email", "role", "position", "title"],
    allowedSortFields: ["name", "sortOrder", "createdAt", "updatedAt"],
    defaultSortField: "sortOrder",
    defaultOrder: "asc",
  });

export const getExecutive = async (id) => findExecutive(id);

export const createExecutive = async (payload, actor) => {
  const executive = await Executive.create(payload);

  await logActivity({
    actor,
    action: "executives.created",
    entityType: "executive",
    entityId: executive._id,
    targetName: executive.name,
    description: "Executive profile created.",
  });

  return executive;
};

export const updateExecutive = async (id, payload, actor) => {
  const executive = await findExecutive(id);

  if (
    payload.profilePicture &&
    executive.profilePicture &&
    payload.profilePicture !== executive.profilePicture
  ) {
    await deleteLocalFileByUrl(executive.profilePicture);
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      executive[key] = value;
    }
  });

  await executive.save();

  await logActivity({
    actor,
    action: "executives.updated",
    entityType: "executive",
    entityId: executive._id,
    targetName: executive.name,
    description: "Executive profile updated.",
  });

  return executive;
};

export const deleteExecutive = async (id, actor) => {
  const executive = await findExecutive(id);
  await deleteLocalFileByUrl(executive.profilePicture);
  await executive.deleteOne();

  await logActivity({
    actor,
    action: "executives.deleted",
    entityType: "executive",
    entityId: executive._id,
    targetName: executive.name,
    description: "Executive profile deleted.",
  });

  return executive;
};
