import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { buildFileUrl } from "../utils/file.js";
import { parseBoolean } from "../utils/parsers.js";
import {
  approveAlumnus,
  createAlumnus,
  deleteAlumnus,
  getAdminAlumnus,
  getPublicAlumnus,
  getOwnProfile,
  listAdminAlumni,
  listExecutiveAlumni,
  listPublicAlumni,
  upsertOwnProfile,
  updateAlumnus,
} from "../services/user.service.js";

const buildUserUpdatePayload = (body) => ({
  fullName: body.fullName,
  phone: body.phone,
  graduationYear: body.graduationYear,
  degree: body.degree,
  specialization: body.specialization,
  currentRole: body.currentRole,
  company: body.company,
  location: body.location,
  bio: body.bio,
  avatarUrl: body.avatarUrl,
  status: body.status,
  associationRoleTitle: body.associationRoleTitle,
  spotlightQuote: body.spotlightQuote,
  isMentorAvailable: parseBoolean(body.isMentorAvailable),
  isSpotlight: parseBoolean(body.isSpotlight),
  consent: parseBoolean(body.consent, true),
  email: body.email,
  password: body.password,
});

const buildSelfProfilePayload = (body) => ({
  fullName: body.fullName,
  phone: body.phone,
  graduationYear: body.graduationYear,
  degree: body.degree,
  specialization: body.specialization,
  currentRole: body.currentRole,
  company: body.company,
  location: body.location,
  bio: body.bio,
  avatarUrl: body.avatarUrl,
  consent: parseBoolean(body.consent),
});

export const getPublicAlumniList = asyncHandler(async (req, res) => {
  const result = await listPublicAlumni(req.query);

  return sendSuccess(res, {
    message: "Alumni fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const getPublicAlumnusById = asyncHandler(async (req, res) => {
  const alumnus = await getPublicAlumnus(req.params.id);

  return sendSuccess(res, {
    message: "Alumnus fetched successfully.",
    data: {
      alumnus,
    },
  });
});

export const getAdminAlumniList = asyncHandler(async (req, res) => {
  const result = await listAdminAlumni(req.query);

  return sendSuccess(res, {
    message: "Admin alumni list fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const createAlumnusByAdmin = asyncHandler(async (req, res) => {
  const alumnus = await createAlumnus(buildUserUpdatePayload(req.body), req.user);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Alumnus created successfully.",
    data: {
      alumnus,
    },
  });
});

export const getExecutiveAlumniList = asyncHandler(async (_req, res) => {
  const executives = await listExecutiveAlumni();

  return sendSuccess(res, {
    message: "Executive alumni fetched successfully.",
    data: {
      executives,
    },
  });
});

export const getAdminAlumnusById = asyncHandler(async (req, res) => {
  const alumnus = await getAdminAlumnus(req.params.id);

  return sendSuccess(res, {
    message: "Admin alumni record fetched successfully.",
    data: {
      alumnus,
    },
  });
});

export const approveAlumnusById = asyncHandler(async (req, res) => {
  const alumnus = await approveAlumnus(req.params.id, req.user);

  return sendSuccess(res, {
    message: "Alumnus approved successfully.",
    data: {
      alumnus,
    },
  });
});

export const updateAlumnusById = asyncHandler(async (req, res) => {
  const alumnus = await updateAlumnus(
    req.params.id,
    buildUserUpdatePayload(req.body),
    req.user,
  );

  return sendSuccess(res, {
    message: "Alumnus updated successfully.",
    data: {
      alumnus,
    },
  });
});

export const deleteAlumnusById = asyncHandler(async (req, res) => {
  const alumnus = await deleteAlumnus(req.params.id, req.user);

  return sendSuccess(res, {
    message: "Alumnus deleted successfully.",
    data: {
      alumnus,
    },
  });
});

export const getOwnProfileController = asyncHandler(async (req, res) => {
  const user = await getOwnProfile(req.user._id);

  return sendSuccess(res, {
    message: "User profile fetched successfully.",
    data: {
      user,
      isProfileComplete: user.isProfileComplete,
    },
  });
});

export const upsertOwnProfileController = asyncHandler(async (req, res) => {
  const payload = buildSelfProfilePayload(req.body);

  if (req.file) {
    payload.avatarUrl = buildFileUrl(req, req.file);
  }

  const user = await upsertOwnProfile(
    req.user._id,
    payload,
    req.user,
  );

  return sendSuccess(res, {
    message: "User profile saved successfully.",
    data: {
      user,
      isProfileComplete: user.isProfileComplete,
    },
  });
});
