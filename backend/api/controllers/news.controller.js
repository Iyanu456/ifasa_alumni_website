import { buildFileUrl } from "../utils/file.js";
import { parseArrayField, parseBoolean } from "../utils/parsers.js";
import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createNews,
  deleteNews,
  getNewsByIdentifier,
  listAdminNews,
  listPublicNews,
  updateNews,
} from "../services/news.service.js";

const buildNewsPayload = (req) => ({
  title: req.body.title,
  excerpt: req.body.excerpt,
  content: req.body.content,
  tags: Object.prototype.hasOwnProperty.call(req.body, "tags")
    ? parseArrayField(req.body.tags)
    : undefined,
  status: req.body.status,
  isFeatured: parseBoolean(req.body.isFeatured),
  coverImageUrl: req.file ? buildFileUrl(req, req.file) : undefined,
});

export const getPublicNewsController = asyncHandler(async (req, res) => {
  const result = await listPublicNews(req.query);

  return sendSuccess(res, {
    message: "News fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const getAdminNewsController = asyncHandler(async (req, res) => {
  const result = await listAdminNews(req.query);

  return sendSuccess(res, {
    message: "Admin news fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const getNewsController = asyncHandler(async (req, res) => {
  const news = await getNewsByIdentifier(req.params.id, false);

  return sendSuccess(res, {
    message: "News item fetched successfully.",
    data: {
      news,
    },
  });
});

export const createNewsController = asyncHandler(async (req, res) => {
  const news = await createNews(buildNewsPayload(req), req.user);

  return sendSuccess(res, {
    statusCode: 201,
    message: "News item created successfully.",
    data: {
      news,
    },
  });
});

export const updateNewsController = asyncHandler(async (req, res) => {
  const news = await updateNews(req.params.id, buildNewsPayload(req), req.user);

  return sendSuccess(res, {
    message: "News item updated successfully.",
    data: {
      news,
    },
  });
});

export const deleteNewsController = asyncHandler(async (req, res) => {
  const news = await deleteNews(req.params.id, req.user);

  return sendSuccess(res, {
    message: "News item deleted successfully.",
    data: {
      news,
    },
  });
});
