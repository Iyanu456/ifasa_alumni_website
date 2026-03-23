import mongoose from "mongoose";
import Event from "../models/event.model.js";
import ApiError from "../utils/api-error.js";
import { createUniqueSlug } from "../utils/slugify.js";
import { deleteLocalFileByUrl } from "../utils/file.js";
import { listDocuments } from "./query.service.js";
import { logActivity } from "./activity.service.js";

const findEvent = async (identifier, includeDraft = false) => {
  const filter = mongoose.isValidObjectId(identifier)
    ? { _id: identifier }
    : { slug: identifier };

  if (!includeDraft) {
    filter.isPublished = true;
  }

  const event = await Event.findOne(filter);

  if (!event) {
    throw new ApiError(404, "Event not found.", "RESOURCE_NOT_FOUND");
  }

  return event;
};

const buildEventFilter = (query = {}, adminView = false) => {
  const filter = {};

  if (!adminView) {
    filter.isPublished = true;
  }

  if (query.category && query.category !== "All") {
    filter.category = query.category;
  }

  if (adminView && query.isPublished !== undefined) {
    filter.isPublished = query.isPublished === "true";
  }

  if (query.timeframe === "upcoming") {
    filter.date = { $gte: new Date() };
  }

  if (query.timeframe === "past") {
    filter.date = { $lt: new Date() };
  }

  if (query.isFeatured !== undefined) {
    filter.isFeatured = query.isFeatured === "true";
  }

  return filter;
};

export const listPublicEvents = async (query) =>
  listDocuments({
    model: Event,
    query,
    filter: buildEventFilter(query, false),
    searchFields: ["title", "location", "description", "category"],
    allowedSortFields: ["date", "title", "createdAt"],
    defaultSortField: "date",
    defaultOrder: "asc",
  });

export const listAdminEvents = async (query) =>
  listDocuments({
    model: Event,
    query,
    filter: buildEventFilter(query, true),
    searchFields: ["title", "location", "description", "category"],
    allowedSortFields: ["date", "title", "createdAt", "updatedAt"],
    defaultSortField: "date",
    defaultOrder: "asc",
  });

export const getEventByIdentifier = async (identifier, adminView = false) =>
  findEvent(identifier, adminView);

export const createEvent = async (payload, actor) => {
  const slug = await createUniqueSlug(Event, payload.title);
  const event = await Event.create({
    ...payload,
    slug,
    createdBy: actor._id,
  });

  await logActivity({
    actor,
    action: "events.created",
    entityType: "event",
    entityId: event._id,
    targetName: event.title,
    description: "Event created.",
  });

  return event;
};

export const updateEvent = async (identifier, payload, actor) => {
  const event = await findEvent(identifier, true);

  if (payload.title && payload.title !== event.title) {
    event.slug = await createUniqueSlug(Event, payload.title, event._id);
  }

  if (payload.coverImageUrl && event.coverImageUrl && payload.coverImageUrl !== event.coverImageUrl) {
    await deleteLocalFileByUrl(event.coverImageUrl);
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      event[key] = value;
    }
  });

  await event.save();

  await logActivity({
    actor,
    action: "events.updated",
    entityType: "event",
    entityId: event._id,
    targetName: event.title,
    description: "Event updated.",
  });

  return event;
};

export const deleteEvent = async (identifier, actor) => {
  const event = await findEvent(identifier, true);
  await deleteLocalFileByUrl(event.coverImageUrl);
  await event.deleteOne();

  await logActivity({
    actor,
    action: "events.deleted",
    entityType: "event",
    entityId: event._id,
    targetName: event.title,
    description: "Event deleted.",
  });

  return event;
};
