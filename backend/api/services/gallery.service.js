import mongoose from "mongoose";
import GalleryItem from "../models/gallery-item.model.js";
import ApiError from "../utils/api-error.js";
import { deleteLocalFileByUrl } from "../utils/file.js";
import { listDocuments } from "./query.service.js";
import { logActivity } from "./activity.service.js";

const findGalleryItem = async (identifier, adminView = false) => {
  const filter = mongoose.isValidObjectId(identifier)
    ? { _id: identifier }
    : { _id: null };

  if (!adminView) {
    filter.isPublished = true;
  }

  const item = await GalleryItem.findOne(filter);

  if (!item) {
    throw new ApiError(404, "Gallery item not found.", "RESOURCE_NOT_FOUND");
  }

  return item;
};

export const listPublicGalleryItems = async (query) =>
  listDocuments({
    model: GalleryItem,
    query,
    filter: {
      ...(query.category && query.category !== "All" ? { category: query.category } : {}),
      isPublished: true,
    },
    searchFields: ["title", "altText", "category"],
    allowedSortFields: ["capturedAt", "createdAt", "title"],
    defaultSortField: "capturedAt",
    defaultOrder: "desc",
  });

export const listAdminGalleryItems = async (query) =>
  listDocuments({
    model: GalleryItem,
    query,
    filter: query.category && query.category !== "All" ? { category: query.category } : {},
    searchFields: ["title", "altText", "category"],
    allowedSortFields: ["capturedAt", "createdAt", "updatedAt", "title"],
    defaultSortField: "capturedAt",
    defaultOrder: "desc",
  });

export const getGalleryItemByIdentifier = async (identifier, adminView = false) =>
  findGalleryItem(identifier, adminView);

export const createGalleryItem = async (payload, actor) => {
  const item = await GalleryItem.create({
    ...payload,
    uploadedBy: actor._id,
  });

  await logActivity({
    actor,
    action: "gallery.created",
    entityType: "gallery",
    entityId: item._id,
    targetName: item.title,
    description: "Gallery item uploaded.",
  });

  return item;
};

export const updateGalleryItem = async (identifier, payload, actor) => {
  const item = await findGalleryItem(identifier, true);

  if (payload.imageUrl && item.imageUrl && payload.imageUrl !== item.imageUrl) {
    await deleteLocalFileByUrl(item.imageUrl);
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      item[key] = value;
    }
  });

  await item.save();

  await logActivity({
    actor,
    action: "gallery.updated",
    entityType: "gallery",
    entityId: item._id,
    targetName: item.title,
    description: "Gallery item updated.",
  });

  return item;
};

export const deleteGalleryItem = async (identifier, actor) => {
  const item = await findGalleryItem(identifier, true);
  await deleteLocalFileByUrl(item.imageUrl);
  await item.deleteOne();

  await logActivity({
    actor,
    action: "gallery.deleted",
    entityType: "gallery",
    entityId: item._id,
    targetName: item.title,
    description: "Gallery item deleted.",
  });

  return item;
};
