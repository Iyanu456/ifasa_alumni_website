import { buildFileUrl } from "../utils/file.js";
import { parseBoolean } from "../utils/parsers.js";
import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createExecutive,
  deleteExecutive,
  getExecutive,
  listAdminExecutives,
  listPublicExecutives,
  updateExecutive,
} from "../services/executive.service.js";

const buildExecutivePayload = (req) => ({
  name: req.body.name,
  email: req.body.email,
  role: req.body.role,
  position: req.body.position,
  title: req.body.title,
  sortOrder:
    req.body.sortOrder !== undefined ? Number.parseInt(req.body.sortOrder, 10) : undefined,
  isPublished: parseBoolean(req.body.isPublished),
  profilePicture: req.file ? buildFileUrl(req, req.file) : undefined,
});

export const getPublicExecutivesController = asyncHandler(async (_req, res) => {
  const executives = await listPublicExecutives();

  return sendSuccess(res, {
    message: "Executives fetched successfully.",
    data: { executives },
  });
});

export const getAdminExecutivesController = asyncHandler(async (req, res) => {
  const result = await listAdminExecutives(req.query);

  return sendSuccess(res, {
    message: "Admin executives fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const getExecutiveController = asyncHandler(async (req, res) => {
  const executive = await getExecutive(req.params.id);

  return sendSuccess(res, {
    message: "Executive fetched successfully.",
    data: { executive },
  });
});

export const createExecutiveController = asyncHandler(async (req, res) => {
  const executive = await createExecutive(buildExecutivePayload(req), req.user);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Executive created successfully.",
    data: { executive },
  });
});

export const updateExecutiveController = asyncHandler(async (req, res) => {
  const executive = await updateExecutive(req.params.id, buildExecutivePayload(req), req.user);

  return sendSuccess(res, {
    message: "Executive updated successfully.",
    data: { executive },
  });
});

export const deleteExecutiveController = asyncHandler(async (req, res) => {
  const executive = await deleteExecutive(req.params.id, req.user);

  return sendSuccess(res, {
    message: "Executive deleted successfully.",
    data: { executive },
  });
});
