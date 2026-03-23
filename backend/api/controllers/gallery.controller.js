import ApiError from "../utils/api-error.js";
import { buildFileUrl } from "../utils/file.js";
import { parseBoolean, parseDateValue } from "../utils/parsers.js";
import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createGalleryItem,
  deleteGalleryItem,
  getGalleryItemByIdentifier,
  listAdminGalleryItems,
  listPublicGalleryItems,
  updateGalleryItem,
} from "../services/gallery.service.js";

const buildGalleryPayload = (req) => ({
  title: req.body.title,
  altText: req.body.altText,
  category: req.body.category,
  capturedAt: parseDateValue(req.body.capturedAt),
  isPublished: parseBoolean(req.body.isPublished),
  imageUrl: req.file ? buildFileUrl(req, req.file) : undefined,
});

export const getPublicGalleryController = asyncHandler(async (req, res) => {
  const result = await listPublicGalleryItems(req.query);

  return sendSuccess(res, {
    message: "Gallery items fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const getAdminGalleryController = asyncHandler(async (req, res) => {
  const result = await listAdminGalleryItems(req.query);

  return sendSuccess(res, {
    message: "Admin gallery items fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const getGalleryItemController = asyncHandler(async (req, res) => {
  const item = await getGalleryItemByIdentifier(req.params.id, false);

  return sendSuccess(res, {
    message: "Gallery item fetched successfully.",
    data: {
      item,
    },
  });
});

export const createGalleryItemController = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Gallery image is required.", "IMAGE_REQUIRED");
  }

  const item = await createGalleryItem(buildGalleryPayload(req), req.user);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Gallery item created successfully.",
    data: {
      item,
    },
  });
});

export const updateGalleryItemController = asyncHandler(async (req, res) => {
  const item = await updateGalleryItem(req.params.id, buildGalleryPayload(req), req.user);

  return sendSuccess(res, {
    message: "Gallery item updated successfully.",
    data: {
      item,
    },
  });
});

export const deleteGalleryItemController = asyncHandler(async (req, res) => {
  const item = await deleteGalleryItem(req.params.id, req.user);

  return sendSuccess(res, {
    message: "Gallery item deleted successfully.",
    data: {
      item,
    },
  });
});
