import { buildFileUrl } from "../utils/file.js";
import {
  parseArrayField,
  parseBoolean,
  parseDateValue,
} from "../utils/parsers.js";
import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createOpportunity,
  deleteOpportunity,
  getOpportunityByIdentifier,
  listAdminOpportunities,
  listPublicOpportunities,
  updateOpportunity,
} from "../services/opportunity.service.js";

const buildOpportunityPayload = (req) => ({
  title: req.body.title,
  organization: req.body.organization,
  category: req.body.category,
  description: req.body.description,
  requirements: Object.prototype.hasOwnProperty.call(req.body, "requirements")
    ? parseArrayField(req.body.requirements)
    : undefined,
  location: req.body.location,
  deadline: parseDateValue(req.body.deadline),
  applicationLink: req.body.applicationLink || req.body.link,
  status: req.body.status,
  isFeatured: parseBoolean(req.body.isFeatured),
  coverImageUrl: req.file ? buildFileUrl(req, req.file) : undefined,
});

export const getPublicOpportunities = asyncHandler(async (req, res) => {
  const result = await listPublicOpportunities(req.query);

  return sendSuccess(res, {
    message: "Opportunities fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const getAdminOpportunities = asyncHandler(async (req, res) => {
  const result = await listAdminOpportunities(req.query);

  return sendSuccess(res, {
    message: "Admin opportunities fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const getOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await getOpportunityByIdentifier(req.params.id, false);

  return sendSuccess(res, {
    message: "Opportunity fetched successfully.",
    data: {
      opportunity,
    },
  });
});

export const createOpportunityController = asyncHandler(async (req, res) => {
  const opportunity = await createOpportunity(buildOpportunityPayload(req), req.user);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Opportunity created successfully.",
    data: {
      opportunity,
    },
  });
});

export const updateOpportunityController = asyncHandler(async (req, res) => {
  const opportunity = await updateOpportunity(
    req.params.id,
    buildOpportunityPayload(req),
    req.user,
  );

  return sendSuccess(res, {
    message: "Opportunity updated successfully.",
    data: {
      opportunity,
    },
  });
});

export const deleteOpportunityController = asyncHandler(async (req, res) => {
  const opportunity = await deleteOpportunity(req.params.id, req.user);

  return sendSuccess(res, {
    message: "Opportunity deleted successfully.",
    data: {
      opportunity,
    },
  });
});
