import {
  errorResponse,
  listMetaExample,
  listMetaSchema,
  paginationParams,
  successResponse,
} from "./helpers.js";

export const adminPaths = {
  "/admin/users": {
    get: {
      tags: ["Admin"],
      summary: "List all platform users for admin management",
      security: [{ bearerAuth: [] }],
      parameters: [
        ...paginationParams,
        { name: "role", in: "query", schema: { type: "string", enum: ["user", "admin", "alumnus"] } },
        { name: "status", in: "query", schema: { type: "string", enum: ["pending", "approved"] } },
        { name: "authProvider", in: "query", schema: { type: "string", enum: ["local", "google"] } },
        { name: "isVerified", in: "query", schema: { type: "boolean" } },
        { name: "isProfileComplete", in: "query", schema: { type: "boolean" } },
      ],
      responses: {
        200: successResponse({
          description: "Users fetched successfully.",
          dataSchema: { type: "array", items: { $ref: "#/components/schemas/User" } },
          metaSchema: listMetaSchema,
          metaExample: listMetaExample,
          example: [{ id: "1", fullName: "Tunde Adebayo", email: "tunde@email.com", role: "user" }],
        }),
        403: errorResponse("Admin access required."),
      },
    },
  },
  "/admin/users/{id}": {
    get: {
      tags: ["Admin"],
      summary: "Get a single user for admin management",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({
          description: "User fetched successfully.",
          dataSchema: { $ref: "#/components/schemas/AdminUserResponse" },
          example: {
            user: { id: "1", fullName: "Tunde Adebayo", email: "tunde@email.com", role: "user" },
          },
        }),
        404: errorResponse("User not found."),
      },
    },
  },
  "/admin/users/{id}/make-admin": {
    patch: {
      tags: ["Admin"],
      summary: "Promote a user to admin",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({
          description: "User promoted to admin successfully.",
          dataSchema: { $ref: "#/components/schemas/AdminUserResponse" },
          example: {
            user: { id: "1", fullName: "Tunde Adebayo", email: "tunde@email.com", role: "admin" },
          },
        }),
      },
    },
  },
  "/admin/users/{id}/remove-admin": {
    patch: {
      tags: ["Admin"],
      summary: "Remove admin role from a user",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({
          description: "Admin role removed successfully.",
          dataSchema: { $ref: "#/components/schemas/AdminUserResponse" },
          example: {
            user: { id: "1", fullName: "Tunde Adebayo", email: "tunde@email.com", role: "user" },
          },
        }),
        400: errorResponse("At least one administrator must remain on the platform."),
      },
    },
  },
};
