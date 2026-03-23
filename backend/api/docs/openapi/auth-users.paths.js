import {
  errorResponse,
  jsonBody,
  listMetaExample,
  listMetaSchema,
  paginationParams,
  successResponse,
} from "./helpers.js";

export const authAndUserPaths = {
  "/health": {
    get: {
      tags: ["Health"],
      summary: "Get API health",
      responses: {
        200: successResponse({
          description: "Service is healthy.",
          dataSchema: { type: "object", properties: { uptime: { type: "number" }, timestamp: { type: "string" }, database: { type: "string" } } },
          example: { uptime: 120.5, timestamp: "2026-03-20T12:00:00.000Z", database: "connected" },
        }),
      },
    },
  },
  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register with email and password",
      requestBody: jsonBody(
        {
          type: "object",
          required: ["fullName", "email", "password", "phone", "graduationYear", "degree", "consent"],
          properties: {
            fullName: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
            phone: { type: "string" },
            graduationYear: { type: "string" },
            degree: { type: "string" },
            specialization: { type: "string" },
            currentRole: { type: "string" },
            company: { type: "string" },
            location: { type: "string" },
            bio: { type: "string" },
            consent: { type: "boolean" },
          },
        },
        { fullName: "Tunde Adebayo", email: "tunde@email.com", password: "StrongPass123", phone: "+2348012345678", graduationYear: "2015", degree: "B.Sc Architecture", consent: true },
      ),
      responses: {
        201: successResponse({
          description: "Registration successful. Please check your email to verify your account.",
          dataSchema: { type: "object", properties: { user: { $ref: "#/components/schemas/User" }, verification: { type: "object", properties: { sent: { type: "boolean" }, expiresAt: { type: "string", format: "date-time" }, previewUrl: { type: "string", nullable: true } } } } },
          example: { user: { id: "1", fullName: "Tunde Adebayo", email: "tunde@email.com", authProvider: "local", isVerified: false, isProfileComplete: true }, verification: { sent: true, expiresAt: "2026-03-21T12:00:00.000Z", previewUrl: null } },
        }),
        400: errorResponse("Validation error."),
        409: errorResponse("User already exists."),
      },
    },
  },
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login with email and password",
      requestBody: jsonBody(
        { type: "object", required: ["email", "password"], properties: { email: { type: "string", format: "email" }, password: { type: "string", format: "password" } } },
        { email: "tunde@email.com", password: "StrongPass123" },
      ),
      responses: {
        200: successResponse({
          description: "Login successful.",
          dataSchema: { $ref: "#/components/schemas/AuthResponse" },
          example: { token: "jwt-token", user: { id: "1", fullName: "Tunde Adebayo", email: "tunde@email.com", authProvider: "local", isProfileComplete: true, isVerified: true }, isProfileComplete: true, requiresProfileCompletion: false },
        }),
        401: errorResponse("Invalid credentials."),
        403: errorResponse("Email not verified or profile incomplete."),
      },
    },
  },
  "/auth/google/initiate": {
    get: {
      tags: ["Auth"],
      summary: "Generate Google OAuth consent URL",
      parameters: [
        {
          name: "redirectUri",
          in: "query",
          schema: { type: "string", format: "uri" },
          description: "Optional frontend redirect URI on the configured client origin.",
        },
        {
          name: "mode",
          in: "query",
          schema: { type: "string", enum: ["redirect", "json"], default: "redirect" },
        },
      ],
      responses: {
        200: successResponse({
          description: "Google OAuth URL generated successfully.",
          dataSchema: {
            type: "object",
            properties: {
              url: { type: "string", format: "uri" },
              redirectUri: { type: "string", format: "uri" },
              responseMode: { type: "string", enum: ["redirect", "json"] },
            },
          },
          example: {
            url: "https://accounts.google.com/o/oauth2/v2/auth?...",
            redirectUri: "http://localhost:3000/login",
            responseMode: "redirect",
          },
        }),
        400: errorResponse("Invalid redirect URI."),
        500: errorResponse("Google auth not configured."),
      },
    },
  },
  "/auth/google/callback": {
    get: {
      tags: ["Auth"],
      summary: "Google OAuth callback handler",
      parameters: [
        { name: "code", in: "query", schema: { type: "string" } },
        { name: "state", in: "query", schema: { type: "string" } },
        { name: "error", in: "query", schema: { type: "string" } },
      ],
      responses: {
        200: successResponse({
          description: "Google authentication successful.",
          dataSchema: { $ref: "#/components/schemas/AuthResponse" },
          example: {
            token: "jwt-token",
            user: {
              id: "2",
              fullName: "Funke Oladipo",
              email: "funke@email.com",
              googleId: "109876543210987654321",
              authProvider: "google",
              isVerified: true,
              isProfileComplete: false,
              role: "user",
              status: "pending",
            },
            isProfileComplete: false,
            requiresProfileCompletion: true,
          },
        }),
        302: {
          description: "Redirects browser back to the frontend with success or error hash parameters.",
        },
        400: errorResponse("Missing or invalid Google callback parameters."),
        401: errorResponse("Google authorization failed."),
      },
    },
  },
  "/auth/resend-verification": {
    post: {
      tags: ["Auth"],
      summary: "Resend verification email",
      requestBody: jsonBody(
        { type: "object", required: ["email"], properties: { email: { type: "string", format: "email" } } },
        { email: "tunde@email.com" },
      ),
      responses: {
        200: successResponse({
          description: "Verification email sent successfully.",
          dataSchema: { type: "object", properties: { sent: { type: "boolean" }, expiresAt: { type: "string", format: "date-time" }, previewUrl: { type: "string", nullable: true } } },
          example: { sent: true, expiresAt: "2026-03-21T12:00:00.000Z", previewUrl: null },
        }),
        404: errorResponse("User not found."),
      },
    },
  },
  "/auth/verify-email/{token}": {
  get: {
    tags: ["Auth"],
    summary: "Verify email address",
    parameters: [
      {
        name: "token",
        in: "path",
        required: true,
        schema: { type: "string" },
      },
    ],
    responses: {
      200: successResponse({
        description: "Email verified successfully.",
        dataSchema: {
          type: "object",
          properties: {
            token: {
              type: "string",
              description: "JWT authentication token",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            isProfileComplete: {
              type: "boolean",
              example: false,
            },
            requiresProfileCompletion: {
              type: "boolean",
              example: true,
            },
          },
        },
        example: {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          user: {
            id: "1",
            fullName: "Tunde Adebayo",
            email: "tunde@email.com",
            isVerified: true,
            isProfileComplete: false,
          },
          isProfileComplete: false,
          requiresProfileCompletion: true,
        },
      }),
      400: errorResponse("Invalid or expired verification token."),
    },
  },
},
  "/auth/me": {
    get: {
      tags: ["Auth"],
      summary: "Get current user after full onboarding",
      security: [{ bearerAuth: [] }],
      responses: {
        200: successResponse({
          description: "Current user fetched successfully.",
          dataSchema: { type: "object", properties: { user: { $ref: "#/components/schemas/User" } } },
          example: { user: { id: "1", fullName: "Tunde Adebayo", email: "tunde@email.com", isProfileComplete: true } },
        }),
        403: errorResponse("Profile completion required."),
      },
    },
  },
  "/users/profile": {
    get: {
      tags: ["Users"],
      summary: "Get current user profile, including incomplete Google accounts",
      security: [{ bearerAuth: [] }],
      responses: {
        200: successResponse({
          description: "User profile fetched successfully.",
          dataSchema: { type: "object", properties: { user: { $ref: "#/components/schemas/User" }, isProfileComplete: { type: "boolean" } } },
          example: { user: { id: "2", fullName: "Funke Oladipo", email: "funke@email.com", authProvider: "google", isProfileComplete: false }, isProfileComplete: false },
        }),
      },
    },
    post: {
      tags: ["Users"],
      summary: "Create or update own biodata profile and complete onboarding",
      security: [{ bearerAuth: [] }],
      requestBody: jsonBody(
        { $ref: "#/components/schemas/ProfileUpdateRequest" },
        { fullName: "Funke Oladipo", phone: "+2348011111111", graduationYear: "2017", degree: "B.Sc Architecture", specialization: "Sustainable Design", currentRole: "Urban Designer", company: "Urban Lab", location: "London, UK", bio: "Focused on sustainable architecture.", consent: true },
      ),
      responses: {
        200: successResponse({
          description: "User profile saved successfully.",
          dataSchema: { type: "object", properties: { user: { $ref: "#/components/schemas/User" }, isProfileComplete: { type: "boolean" } } },
          example: { user: { id: "2", fullName: "Funke Oladipo", email: "funke@email.com", authProvider: "google", isProfileComplete: true }, isProfileComplete: true },
        }),
        422: errorResponse("Profile validation failed."),
      },
    },
  },
  "/alumni": {
    get: {
      tags: ["Alumni"],
      summary: "List approved and profile-complete alumni",
      parameters: [...paginationParams, { name: "graduationYear", in: "query", schema: { type: "string" } }],
      responses: {
        200: successResponse({
          description: "Alumni fetched successfully.",
          dataSchema: { type: "array", items: { $ref: "#/components/schemas/User" } },
          metaSchema: listMetaSchema,
          metaExample: listMetaExample,
          example: [{ id: "1", fullName: "Tunde Adebayo", email: "tunde@email.com", isProfileComplete: true }],
        }),
      },
    },
  },
  "/alumni/executives": {
    get: {
      tags: ["Alumni"],
      summary: "List public alumni executives",
      responses: {
        200: successResponse({
          description: "Executive alumni fetched successfully.",
          dataSchema: {
            type: "object",
            properties: {
              executives: {
                type: "array",
                items: { $ref: "#/components/schemas/User" },
              },
            },
          },
          example: {
            executives: [
              {
                id: "1",
                fullName: "Engr. Tunde Adebayo",
                associationRoleTitle: "President",
                email: "tunde@email.com",
              },
            ],
          },
        }),
      },
    },
  },
  "/alumni/admin": {
    get: {
      tags: ["Alumni"],
      summary: "List alumni for admin",
      security: [{ bearerAuth: [] }],
      parameters: [...paginationParams, { name: "status", in: "query", schema: { type: "string" } }, { name: "isVerified", in: "query", schema: { type: "boolean" } }, { name: "isProfileComplete", in: "query", schema: { type: "boolean" } }],
      responses: {
        200: successResponse({
          description: "Admin alumni list fetched successfully.",
          dataSchema: { type: "array", items: { $ref: "#/components/schemas/User" } },
          metaSchema: listMetaSchema,
          metaExample: listMetaExample,
          example: [{ id: "1", fullName: "Tunde Adebayo", email: "tunde@email.com" }],
        }),
      },
    },
  },
  "/alumni/admin/{id}": {
    get: {
      tags: ["Alumni"],
      summary: "Get admin alumni record",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({
          description: "Admin alumni record fetched successfully.",
          dataSchema: { type: "object", properties: { alumnus: { $ref: "#/components/schemas/User" } } },
          example: { alumnus: { id: "1", fullName: "Tunde Adebayo", email: "tunde@email.com" } },
        }),
      },
    },
  },
  "/alumni/{id}": {
    get: {
      tags: ["Alumni"],
      summary: "Get public alumni profile",
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({
          description: "Alumnus fetched successfully.",
          dataSchema: { type: "object", properties: { alumnus: { $ref: "#/components/schemas/User" } } },
          example: { alumnus: { id: "1", fullName: "Tunde Adebayo", email: "tunde@email.com" } },
        }),
      },
    },
    patch: {
      tags: ["Alumni"],
      summary: "Update alumni record",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      requestBody: jsonBody(
        {
          allOf: [
            { $ref: "#/components/schemas/ProfileUpdateRequest" },
            { type: "object", properties: { status: { type: "string", enum: ["pending", "approved"] }, associationRoleTitle: { type: "string" }, spotlightQuote: { type: "string" }, isMentorAvailable: { type: "boolean" }, isSpotlight: { type: "boolean" } } },
          ],
        },
        { fullName: "Tunde Adebayo", status: "approved", isMentorAvailable: true },
      ),
      responses: {
        200: successResponse({
          description: "Alumnus updated successfully.",
          dataSchema: { type: "object", properties: { alumnus: { $ref: "#/components/schemas/User" } } },
          example: { alumnus: { id: "1", fullName: "Tunde Adebayo", status: "approved" } },
        }),
      },
    },
    delete: {
      tags: ["Alumni"],
      summary: "Delete alumni record",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({
          description: "Alumnus deleted successfully.",
          dataSchema: { type: "object", properties: { alumnus: { $ref: "#/components/schemas/User" } } },
          example: { alumnus: { id: "1", fullName: "Tunde Adebayo" } },
        }),
      },
    },
  },
  "/alumni/{id}/approve": {
    patch: {
      tags: ["Alumni"],
      summary: "Approve alumni record",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({
          description: "Alumnus approved successfully.",
          dataSchema: { type: "object", properties: { alumnus: { $ref: "#/components/schemas/User" } } },
          example: { alumnus: { id: "1", fullName: "Tunde Adebayo", status: "approved" } },
        }),
      },
    },
  },
};
