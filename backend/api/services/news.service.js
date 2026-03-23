import mongoose from "mongoose";
import News from "../models/news.model.js";
import ApiError from "../utils/api-error.js";
import { createUniqueSlug } from "../utils/slugify.js";
import { deleteLocalFileByUrl } from "../utils/file.js";
import { listDocuments } from "./query.service.js";
import { logActivity } from "./activity.service.js";

const createExcerpt = (content) =>
  content
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);

const findNews = async (identifier, adminView = false) => {
  const filter = mongoose.isValidObjectId(identifier)
    ? { _id: identifier }
    : { slug: identifier };

  if (!adminView) {
    filter.status = "published";
  }

  const news = await News.findOne(filter);

  if (!news) {
    throw new ApiError(404, "News item not found.", "RESOURCE_NOT_FOUND");
  }

  return news;
};

export const listPublicNews = async (query) =>
  listDocuments({
    model: News,
    query,
    filter: {
      status: "published",
    },
    searchFields: ["title", "content", "excerpt", "tags"],
    allowedSortFields: ["publishedAt", "createdAt", "title"],
    defaultSortField: "publishedAt",
    defaultOrder: "desc",
  });

export const listAdminNews = async (query) =>
  listDocuments({
    model: News,
    query,
    filter: query.status ? { status: query.status } : {},
    searchFields: ["title", "content", "excerpt", "tags", "authorName"],
    allowedSortFields: ["publishedAt", "createdAt", "updatedAt", "title"],
    defaultSortField: "createdAt",
    defaultOrder: "desc",
  });

export const getNewsByIdentifier = async (identifier, adminView = false) =>
  findNews(identifier, adminView);

export const createNews = async (payload, actor) => {
  const slug = await createUniqueSlug(News, payload.title);
  const news = await News.create({
    ...payload,
    slug,
    excerpt: payload.excerpt || createExcerpt(payload.content),
    publishedAt: payload.status === "published" ? new Date() : undefined,
    author: actor._id,
    authorName: actor.fullName,
  });

  await logActivity({
    actor,
    action: "news.created",
    entityType: "news",
    entityId: news._id,
    targetName: news.title,
    description: "News item created.",
  });

  return news;
};

export const updateNews = async (identifier, payload, actor) => {
  const news = await findNews(identifier, true);

  if (payload.title && payload.title !== news.title) {
    news.slug = await createUniqueSlug(News, payload.title, news._id);
  }

  if (payload.coverImageUrl && news.coverImageUrl && payload.coverImageUrl !== news.coverImageUrl) {
    await deleteLocalFileByUrl(news.coverImageUrl);
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      news[key] = value;
    }
  });

  if (!payload.excerpt && payload.content) {
    news.excerpt = createExcerpt(payload.content);
  }

  if (payload.status === "published" && !news.publishedAt) {
    news.publishedAt = new Date();
  }

  if (payload.status === "draft") {
    news.publishedAt = undefined;
  }

  await news.save();

  await logActivity({
    actor,
    action: "news.updated",
    entityType: "news",
    entityId: news._id,
    targetName: news.title,
    description: "News item updated.",
  });

  return news;
};

export const deleteNews = async (identifier, actor) => {
  const news = await findNews(identifier, true);
  await deleteLocalFileByUrl(news.coverImageUrl);
  await news.deleteOne();

  await logActivity({
    actor,
    action: "news.deleted",
    entityType: "news",
    entityId: news._id,
    targetName: news.title,
    description: "News item deleted.",
  });

  return news;
};
