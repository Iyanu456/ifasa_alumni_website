import { adminPaths } from "./openapi/admin.paths.js";
import { authAndUserPaths } from "./openapi/auth-users.paths.js";
import { components, tags } from "./openapi/components.js";
import { contentPaths } from "./openapi/content.paths.js";
import { operationsPaths } from "./openapi/operations.paths.js";

const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "IFASA Alumni API",
    version: "1.0.0",
    description:
      "Production-ready backend for the IFASA alumni platform, including email/password auth, Google Sign-In, onboarding, alumni directory, content management, donations, inquiries, settings, and dashboard endpoints.",
  },
  servers: [
    {
      url: "/api/v1",
      description: "Version 1",
    },
  ],
  tags,
  components,
  paths: {
    ...authAndUserPaths,
    ...adminPaths,
    ...contentPaths,
    ...operationsPaths,
  },
};

export default swaggerSpec;
