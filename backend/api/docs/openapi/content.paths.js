import {
  errorResponse,
  jsonOrMultipartBody,
  listMetaExample,
  listMetaSchema,
  paginationParams,
  successResponse,
} from "./helpers.js";

const eventBody = {
  type: "object",
  properties: {
    title: { type: "string", example: "IFASA Global Reunion 2026" },
    category: { type: "string", example: "Reunion" },
    date: { type: "string", format: "date-time", example: "2026-08-10T10:00:00.000Z" },
    location: { type: "string", example: "Lagos, Nigeria" },
    description: { type: "string", example: "An in-person reunion for alumni." },
    registrationLink: { type: "string", format: "uri", nullable: true },
    rsvp: { type: "string", format: "uri", nullable: true },
    isPublished: { type: "boolean", example: true },
    isFeatured: { type: "boolean", example: true },
    image: { type: "string", format: "binary" },
  },
  required: ["title", "category", "date", "location", "description"],
};

const opportunityBody = {
  type: "object",
  properties: {
    title: { type: "string", example: "Graduate Architect" },
    organization: { type: "string", example: "Studio Nexus" },
    category: { type: "string", example: "Job" },
    description: { type: "string", example: "Entry-level role for a design team." },
    requirements: {
      oneOf: [{ type: "array", items: { type: "string" } }, { type: "string" }],
      example: ["Portfolio", "B.Sc Architecture"],
    },
    location: { type: "string", nullable: true, example: "Abuja, Nigeria" },
    deadline: { type: "string", format: "date-time", nullable: true },
    applicationLink: { type: "string", format: "uri", nullable: true },
    link: { type: "string", format: "uri", nullable: true },
    status: { type: "string", enum: ["open", "closed"], example: "open" },
    isFeatured: { type: "boolean", example: false },
    image: { type: "string", format: "binary" },
  },
  required: ["title", "organization", "category", "description"],
};

const newsBody = {
  type: "object",
  properties: {
    title: { type: "string", example: "IFASA Alumni Spotlight Series Launches" },
    excerpt: { type: "string", nullable: true },
    content: { type: "string", example: "The alumni association is launching..." },
    tags: {
      oneOf: [{ type: "array", items: { type: "string" } }, { type: "string" }],
      example: ["alumni", "spotlight"],
    },
    status: { type: "string", enum: ["draft", "published"], example: "published" },
    isFeatured: { type: "boolean", example: true },
    image: { type: "string", format: "binary" },
  },
  required: ["title", "content"],
};

const galleryBody = {
  type: "object",
  properties: {
    title: { type: "string", example: "2026 Reunion Photo Wall" },
    altText: { type: "string", nullable: true },
    category: { type: "string", example: "Reunions" },
    capturedAt: { type: "string", format: "date-time", nullable: true },
    isPublished: { type: "boolean", example: true },
    image: { type: "string", format: "binary" },
  },
  required: ["title"],
};

const eventFilters = [
  ...paginationParams,
  { name: "category", in: "query", schema: { type: "string" } },
  { name: "timeframe", in: "query", schema: { type: "string", enum: ["upcoming", "past", "all"] } },
  { name: "isPublished", in: "query", schema: { type: "boolean" } },
  { name: "isFeatured", in: "query", schema: { type: "boolean" } },
];

const opportunityFilters = [
  ...paginationParams,
  { name: "category", in: "query", schema: { type: "string" } },
  { name: "status", in: "query", schema: { type: "string", enum: ["open", "closed"] } },
  { name: "isFeatured", in: "query", schema: { type: "boolean" } },
];

const newsFilters = [
  ...paginationParams,
  { name: "status", in: "query", schema: { type: "string", enum: ["draft", "published"] } },
];

const galleryFilters = [
  ...paginationParams,
  { name: "category", in: "query", schema: { type: "string" } },
];

const itemResponses = {
  event: {
    schema: { type: "object", properties: { event: { $ref: "#/components/schemas/Event" } } },
    example: { event: { id: "1", title: "IFASA Global Reunion 2026", category: "Reunion" } },
  },
  opportunity: {
    schema: { type: "object", properties: { opportunity: { $ref: "#/components/schemas/Opportunity" } } },
    example: { opportunity: { id: "1", title: "Graduate Architect", organization: "Studio Nexus" } },
  },
  news: {
    schema: { type: "object", properties: { news: { $ref: "#/components/schemas/News" } } },
    example: { news: { id: "1", title: "IFASA Alumni Spotlight Series Launches" } },
  },
  gallery: {
    schema: { type: "object", properties: { item: { $ref: "#/components/schemas/GalleryItem" } } },
    example: { item: { id: "1", title: "2026 Reunion Photo Wall", category: "Reunions" } },
  },
};

export const contentPaths = {
  "/events": {
    get: {
      tags: ["Events"],
      summary: "List public events",
      parameters: eventFilters,
      responses: {
        200: successResponse({
          description: "Events fetched successfully.",
          dataSchema: { type: "array", items: { $ref: "#/components/schemas/Event" } },
          metaSchema: listMetaSchema,
          metaExample: listMetaExample,
          example: [{ id: "1", title: "IFASA Global Reunion 2026" }],
        }),
      },
    },
    post: {
      tags: ["Events"],
      summary: "Create event",
      security: [{ bearerAuth: [] }],
      requestBody: jsonOrMultipartBody(eventBody, {
        title: "IFASA Global Reunion 2026",
        category: "Reunion",
        date: "2026-08-10T10:00:00.000Z",
        location: "Lagos, Nigeria",
        description: "An in-person reunion for alumni.",
      }),
      responses: {
        201: successResponse({
          description: "Event created successfully.",
          dataSchema: itemResponses.event.schema,
          example: itemResponses.event.example,
        }),
        400: errorResponse("Validation error."),
      },
    },
  },
  "/events/admin": {
    get: {
      tags: ["Events"],
      summary: "List events for admin management",
      security: [{ bearerAuth: [] }],
      parameters: eventFilters,
      responses: {
        200: successResponse({
          description: "Admin events fetched successfully.",
          dataSchema: { type: "array", items: { $ref: "#/components/schemas/Event" } },
          metaSchema: listMetaSchema,
          metaExample: listMetaExample,
          example: [{ id: "1", title: "IFASA Global Reunion 2026", isPublished: false }],
        }),
      },
    },
  },
  "/events/{id}": {
    get: {
      tags: ["Events"],
      summary: "Get event by id or slug",
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({ description: "Event fetched successfully.", dataSchema: itemResponses.event.schema, example: itemResponses.event.example }),
        404: errorResponse("Event not found."),
      },
    },
    patch: {
      tags: ["Events"],
      summary: "Update event",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      requestBody: jsonOrMultipartBody(eventBody, { title: "IFASA Global Reunion 2026", isFeatured: false }),
      responses: {
        200: successResponse({ description: "Event updated successfully.", dataSchema: itemResponses.event.schema, example: itemResponses.event.example }),
      },
    },
    delete: {
      tags: ["Events"],
      summary: "Delete event",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({ description: "Event deleted successfully.", dataSchema: itemResponses.event.schema, example: itemResponses.event.example }),
      },
    },
  },
  "/opportunities": {
    get: {
      tags: ["Opportunities"],
      summary: "List public opportunities",
      parameters: opportunityFilters,
      responses: {
        200: successResponse({
          description: "Opportunities fetched successfully.",
          dataSchema: { type: "array", items: { $ref: "#/components/schemas/Opportunity" } },
          metaSchema: listMetaSchema,
          metaExample: listMetaExample,
          example: [{ id: "1", title: "Graduate Architect", organization: "Studio Nexus" }],
        }),
      },
    },
    post: {
      tags: ["Opportunities"],
      summary: "Create opportunity",
      security: [{ bearerAuth: [] }],
      requestBody: jsonOrMultipartBody(opportunityBody, {
        title: "Graduate Architect",
        organization: "Studio Nexus",
        category: "Job",
        description: "Entry-level role for a design team.",
      }),
      responses: {
        201: successResponse({
          description: "Opportunity created successfully.",
          dataSchema: itemResponses.opportunity.schema,
          example: itemResponses.opportunity.example,
        }),
      },
    },
  },
  "/opportunities/admin": {
    get: {
      tags: ["Opportunities"],
      summary: "List opportunities for admin management",
      security: [{ bearerAuth: [] }],
      parameters: opportunityFilters,
      responses: {
        200: successResponse({
          description: "Admin opportunities fetched successfully.",
          dataSchema: { type: "array", items: { $ref: "#/components/schemas/Opportunity" } },
          metaSchema: listMetaSchema,
          metaExample: listMetaExample,
          example: [{ id: "1", title: "Graduate Architect", status: "open" }],
        }),
      },
    },
  },
  "/opportunities/{id}": {
    get: {
      tags: ["Opportunities"],
      summary: "Get opportunity by id or slug",
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({ description: "Opportunity fetched successfully.", dataSchema: itemResponses.opportunity.schema, example: itemResponses.opportunity.example }),
        404: errorResponse("Opportunity not found."),
      },
    },
    patch: {
      tags: ["Opportunities"],
      summary: "Update opportunity",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      requestBody: jsonOrMultipartBody(opportunityBody, { title: "Graduate Architect", status: "closed" }),
      responses: {
        200: successResponse({ description: "Opportunity updated successfully.", dataSchema: itemResponses.opportunity.schema, example: itemResponses.opportunity.example }),
      },
    },
    delete: {
      tags: ["Opportunities"],
      summary: "Delete opportunity",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({ description: "Opportunity deleted successfully.", dataSchema: itemResponses.opportunity.schema, example: itemResponses.opportunity.example }),
      },
    },
  },
  "/news": {
    get: {
      tags: ["News"],
      summary: "List published news items",
      parameters: newsFilters,
      responses: {
        200: successResponse({
          description: "News fetched successfully.",
          dataSchema: { type: "array", items: { $ref: "#/components/schemas/News" } },
          metaSchema: listMetaSchema,
          metaExample: listMetaExample,
          example: [{ id: "1", title: "IFASA Alumni Spotlight Series Launches" }],
        }),
      },
    },
    post: {
      tags: ["News"],
      summary: "Create news item",
      security: [{ bearerAuth: [] }],
      requestBody: jsonOrMultipartBody(newsBody, {
        title: "IFASA Alumni Spotlight Series Launches",
        content: "The alumni association is launching...",
        status: "published",
      }),
      responses: {
        201: successResponse({
          description: "News item created successfully.",
          dataSchema: itemResponses.news.schema,
          example: itemResponses.news.example,
        }),
      },
    },
  },
  "/news/admin": {
    get: {
      tags: ["News"],
      summary: "List news items for admin",
      security: [{ bearerAuth: [] }],
      parameters: newsFilters,
      responses: {
        200: successResponse({
          description: "Admin news fetched successfully.",
          dataSchema: { type: "array", items: { $ref: "#/components/schemas/News" } },
          metaSchema: listMetaSchema,
          metaExample: listMetaExample,
          example: [{ id: "1", title: "IFASA Alumni Spotlight Series Launches", status: "draft" }],
        }),
      },
    },
  },
  "/news/{id}": {
    get: {
      tags: ["News"],
      summary: "Get news item by id or slug",
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({ description: "News item fetched successfully.", dataSchema: itemResponses.news.schema, example: itemResponses.news.example }),
        404: errorResponse("News item not found."),
      },
    },
    patch: {
      tags: ["News"],
      summary: "Update news item",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      requestBody: jsonOrMultipartBody(newsBody, { title: "IFASA Alumni Spotlight Series Launches", status: "draft" }),
      responses: {
        200: successResponse({ description: "News item updated successfully.", dataSchema: itemResponses.news.schema, example: itemResponses.news.example }),
      },
    },
    delete: {
      tags: ["News"],
      summary: "Delete news item",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({ description: "News item deleted successfully.", dataSchema: itemResponses.news.schema, example: itemResponses.news.example }),
      },
    },
  },
  "/gallery": {
    get: {
      tags: ["Gallery"],
      summary: "List public gallery items",
      parameters: galleryFilters,
      responses: {
        200: successResponse({
          description: "Gallery items fetched successfully.",
          dataSchema: { type: "array", items: { $ref: "#/components/schemas/GalleryItem" } },
          metaSchema: listMetaSchema,
          metaExample: listMetaExample,
          example: [{ id: "1", title: "2026 Reunion Photo Wall", category: "Reunions" }],
        }),
      },
    },
    post: {
      tags: ["Gallery"],
      summary: "Create gallery item",
      security: [{ bearerAuth: [] }],
      requestBody: jsonOrMultipartBody(galleryBody, { title: "2026 Reunion Photo Wall", category: "Reunions" }),
      responses: {
        201: successResponse({
          description: "Gallery item created successfully.",
          dataSchema: itemResponses.gallery.schema,
          example: itemResponses.gallery.example,
        }),
        400: errorResponse("Gallery image is required."),
      },
    },
  },
  "/gallery/admin": {
    get: {
      tags: ["Gallery"],
      summary: "List gallery items for admin",
      security: [{ bearerAuth: [] }],
      parameters: galleryFilters,
      responses: {
        200: successResponse({
          description: "Admin gallery items fetched successfully.",
          dataSchema: { type: "array", items: { $ref: "#/components/schemas/GalleryItem" } },
          metaSchema: listMetaSchema,
          metaExample: listMetaExample,
          example: [{ id: "1", title: "2026 Reunion Photo Wall" }],
        }),
      },
    },
  },
  "/gallery/{id}": {
    get: {
      tags: ["Gallery"],
      summary: "Get gallery item by id",
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({ description: "Gallery item fetched successfully.", dataSchema: itemResponses.gallery.schema, example: itemResponses.gallery.example }),
        404: errorResponse("Gallery item not found."),
      },
    },
    patch: {
      tags: ["Gallery"],
      summary: "Update gallery item",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      requestBody: jsonOrMultipartBody(galleryBody, { title: "2026 Reunion Photo Wall", isPublished: false }),
      responses: {
        200: successResponse({ description: "Gallery item updated successfully.", dataSchema: itemResponses.gallery.schema, example: itemResponses.gallery.example }),
      },
    },
    delete: {
      tags: ["Gallery"],
      summary: "Delete gallery item",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: successResponse({ description: "Gallery item deleted successfully.", dataSchema: itemResponses.gallery.schema, example: itemResponses.gallery.example }),
      },
    },
  },
};
