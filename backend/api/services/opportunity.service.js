import mongoose from "mongoose";
import Opportunity from "../models/opportunity.model.js";
import ApiError from "../utils/api-error.js";
import { createUniqueSlug } from "../utils/slugify.js";
import { deleteLocalFileByUrl } from "../utils/file.js";
import { listDocuments } from "./query.service.js";
import { logActivity } from "./activity.service.js";

const today = () => new Date();

const buildOpportunityFilter = (query = {}, adminView = false) => {
  const filter = {};

  if (!adminView) {
    filter.status = "open";
    filter.$or = [
      { deadline: { $gte: today() } },
      { deadline: { $exists: false } },
      { deadline: null },
    ];
  }

  if (query.category && query.category !== "All") {
    filter.category = query.category;
  }

  if (adminView && query.status) {
    filter.status = query.status;
  }

  if (query.isFeatured !== undefined) {
    filter.isFeatured = query.isFeatured === "true";
  }

  return filter;
};

const findOpportunity = async (identifier, adminView = false) => {
  const filter = mongoose.isValidObjectId(identifier)
    ? { _id: identifier }
    : { slug: identifier };

  if (!adminView) {
    Object.assign(filter, {
      status: "open",
    });
  }

  const opportunity = await Opportunity.findOne(filter);

  if (!opportunity) {
    throw new ApiError(404, "Opportunity not found.", "RESOURCE_NOT_FOUND");
  }

  return opportunity;
};

export const listPublicOpportunities = async (query) =>
  listDocuments({
    model: Opportunity,
    query,
    filter: buildOpportunityFilter(query, false),
    searchFields: ["title", "organization", "description", "location"],
    allowedSortFields: ["deadline", "createdAt", "title"],
    defaultSortField: "deadline",
    defaultOrder: "asc",
  });

export const listAdminOpportunities = async (query) =>
  listDocuments({
    model: Opportunity,
    query,
    filter: buildOpportunityFilter(query, true),
    searchFields: ["title", "organization", "description", "location"],
    allowedSortFields: ["deadline", "createdAt", "updatedAt", "title"],
    defaultSortField: "createdAt",
    defaultOrder: "desc",
  });

export const getOpportunityByIdentifier = async (identifier, adminView = false) =>
  findOpportunity(identifier, adminView);

export const createOpportunity = async (payload, actor) => {
  const slug = await createUniqueSlug(Opportunity, payload.title);
  const opportunity = await Opportunity.create({
    ...payload,
    slug,
    createdBy: actor._id,
  });

  await logActivity({
    actor,
    action: "opportunities.created",
    entityType: "opportunity",
    entityId: opportunity._id,
    targetName: opportunity.title,
    description: "Opportunity created.",
  });

  return opportunity;
};

export const updateOpportunity = async (identifier, payload, actor) => {
  const opportunity = await findOpportunity(identifier, true);

  if (payload.title && payload.title !== opportunity.title) {
    opportunity.slug = await createUniqueSlug(
      Opportunity,
      payload.title,
      opportunity._id,
    );
  }

  if (
    payload.coverImageUrl &&
    opportunity.coverImageUrl &&
    payload.coverImageUrl !== opportunity.coverImageUrl
  ) {
    await deleteLocalFileByUrl(opportunity.coverImageUrl);
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      opportunity[key] = value;
    }
  });

  await opportunity.save();

  await logActivity({
    actor,
    action: "opportunities.updated",
    entityType: "opportunity",
    entityId: opportunity._id,
    targetName: opportunity.title,
    description: "Opportunity updated.",
  });

  return opportunity;
};

export const deleteOpportunity = async (identifier, actor) => {
  const opportunity = await findOpportunity(identifier, true);
  await deleteLocalFileByUrl(opportunity.coverImageUrl);
  await opportunity.deleteOne();

  await logActivity({
    actor,
    action: "opportunities.deleted",
    entityType: "opportunity",
    entityId: opportunity._id,
    targetName: opportunity.title,
    description: "Opportunity deleted.",
  });

  return opportunity;
};
