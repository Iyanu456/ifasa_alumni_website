import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  getUserForAdmin,
  listUsersForAdmin,
  makeUserAdmin,
  removeUserAdminRole,
} from "../services/admin.service.js";

export const listAdminUsersController = asyncHandler(async (req, res) => {
  const result = await listUsersForAdmin(req.query);

  return sendSuccess(res, {
    message: "Users fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const getAdminUserController = asyncHandler(async (req, res) => {
  const user = await getUserForAdmin(req.params.id);

  return sendSuccess(res, {
    message: "User fetched successfully.",
    data: {
      user,
    },
  });
});

export const makeAdminController = asyncHandler(async (req, res) => {
  const user = await makeUserAdmin(req.params.id, req.user);

  return sendSuccess(res, {
    message: "User promoted to admin successfully.",
    data: {
      user,
    },
  });
});

export const removeAdminController = asyncHandler(async (req, res) => {
  const user = await removeUserAdminRole(req.params.id, req.user);

  return sendSuccess(res, {
    message: "Admin role removed successfully.",
    data: {
      user,
    },
  });
});
