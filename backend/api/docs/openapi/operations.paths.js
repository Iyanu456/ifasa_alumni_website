import {
  jsonBody,
  listMetaExample,
  listMetaSchema,
  paginationParams,
  successResponse,
} from "./helpers.js";

const donationBody = {
  type: "object",
  required: ["amount"],
  properties: {
    amount: { type: "number", minimum: 1, example: 50000 },
    donorName: { type: "string", nullable: true, example: "Anonymous Donor" },
    email: { type: "string", format: "email", nullable: true, example: "donor@email.com" },
    note: { type: "string", nullable: true, example: "Supporting the 2026 reunion program." },
  },
};

const donationStatusBody = {
  type: "object",
  required: ["status"],
  properties: {
    status: { type: "string", enum: ["pending", "completed", "failed"], example: "completed" },
  },
};

const contactBody = {
  type: "object",
  required: ["name", "email", "message"],
  properties: {
    name: { type: "string", example: "Amina Yusuf" },
    email: { type: "string", format: "email", example: "amina@email.com" },
    message: { type: "string", example: "I would like to learn more about alumni membership." },
  },
};

const sponsorshipBody = {
  type: "object",
  required: ["name", "email", "message"],
  properties: {
    name: { type: "string", example: "David Cole" },
    email: { type: "string", format: "email", example: "david@brand.com" },
    organization: { type: "string", nullable: true, example: "BuildSpace Africa" },
    message: { type: "string", example: "We would like to sponsor the annual alumni summit." },
  },
};

const settingsBody = {
  type: "object",
  properties: {
    siteName: { type: "string", example: "IFASA Alumni Network" },
    siteDescription: { type: "string", example: "Connecting alumni and opportunities." },
    contactEmail: { type: "string", format: "email", example: "hello@ifasa.org" },
    contactPhone: { type: "string", example: "+2348012345678" },
    contactAddress: { type: "string", example: "Lagos, Nigeria" },
    donationLink: { type: "string", format: "uri", nullable: true },
    donationAccountNumber: { type: "string", nullable: true, example: "0123456789" },
    donationBankName: { type: "string", nullable: true, example: "First Bank" },
    footerText: { type: "string", nullable: true, example: "Connecting alumni across the world." },
    instagram: { type: "string", format: "uri", nullable: true },
    linkedin: { type: "string", format: "uri", nullable: true },
    twitter: { type: "string", format: "uri", nullable: true },
    socialLinks: {
      type: "object",
      nullable: true,
      properties: {
        instagram: { type: "string", format: "uri", nullable: true },
        linkedin: { type: "string", format: "uri", nullable: true },
        twitter: { type: "string", format: "uri", nullable: true },
      },
    },
    allowRegistrations: { type: "boolean", example: true },
    enableDonations: { type: "boolean", example: true },
  },
};

const adminQueryParams = (statusValues) => [
  ...paginationParams,
  { name: "status", in: "query", schema: { type: "string", enum: statusValues } },
];

const statusBody = (values, example) => ({
  type: "object",
  required: ["status"],
  properties: {
    status: { type: "string", enum: values, example },
  },
});

export const operationsPaths = {
  "/donations/summary": {
    get: {
      tags: ["Donations"],
      summary: "Get public donation summary",
      responses: {
        200: successResponse({
          description: "Donation summary fetched successfully.",
          dataSchema: {
            type: "object",
            properties: {
              totalAmount: { type: "number" },
              totalDonations: { type: "integer" },
              pendingDonations: { type: "integer" },
              donorCount: { type: "integer" },
            },
          },
          example: {
            totalAmount: 1200000,
            totalDonations: 18,
            pendingDonations: 3,
            donorCount: 18,
          },
        }),
      },
    },
  },
  "/donations": {
    post: {
      tags: ["Donations"],
      summary: "Create donation",
      requestBody: jsonBody(donationBody, { amount: 50000, donorName: "Anonymous Donor" }),
      responses: {
        201: successResponse({
          description: "Donation created successfully.",
          dataSchema: { type: "object", properties: { donation: { $ref: "#/components/schemas/Donation" } } },
          example: { donation: { id: "1", donorName: "Anonymous Donor", amount: 50000, status: "pending" } },
        }),
      },
    },
  },
  "/donations/admin": {
    get: {
      tags: ["Donations"],
      summary: "List donations for admin",
      security: [{ bearerAuth: [] }],
      parameters: adminQueryParams(["pending", "completed", "failed"]),
      responses: {
        200: successResponse({
          description: "Donations fetched successfully.",
          dataSchema: { type: "array", items: { $ref: "#/components/schemas/Donation" } },
          metaSchema: listMetaSchema,
          metaExample: listMetaExample,
          example: [{ id: "1", amount: 50000, status: "pending" }],
        }),
      },
    },
  },
  "/donations/{id}/status": {
    patch: {
      tags: ["Donations"],
      summary: "Update donation status",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      requestBody: jsonBody(donationStatusBody, { status: "completed" }),
      responses: {
        200: successResponse({
          description: "Donation status updated successfully.",
          dataSchema: { type: "object", properties: { donation: { $ref: "#/components/schemas/Donation" } } },
          example: { donation: { id: "1", amount: 50000, status: "completed" } },
        }),
      },
    },
  },
  "/inquiries/contact": {
    post: {
      tags: ["Inquiries"],
      summary: "Submit contact message",
      requestBody: jsonBody(contactBody, {
        name: "Amina Yusuf",
        email: "amina@email.com",
        message: "I would like to learn more about alumni membership.",
      }),
      responses: {
        201: successResponse({
          description: "Message sent successfully.",
          dataSchema: { type: "object", properties: { message: { $ref: "#/components/schemas/ContactMessage" } } },
          example: { message: { id: "1", name: "Amina Yusuf", status: "new" } },
        }),
      },
    },
    get: {
      tags: ["Inquiries"],
      summary: "List contact messages for admin",
      security: [{ bearerAuth: [] }],
      parameters: adminQueryParams(["new", "read", "resolved"]),
      responses: {
        200: successResponse({
          description: "Contact messages fetched successfully.",
          dataSchema: { type: "array", items: { $ref: "#/components/schemas/ContactMessage" } },
          metaSchema: listMetaSchema,
          metaExample: listMetaExample,
          example: [{ id: "1", name: "Amina Yusuf", status: "new" }],
        }),
      },
    },
  },
  "/inquiries/contact/{id}/status": {
    patch: {
      tags: ["Inquiries"],
      summary: "Update contact message status",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      requestBody: jsonBody(statusBody(["new", "read", "resolved"], "resolved"), { status: "resolved" }),
      responses: {
        200: successResponse({
          description: "Contact message status updated successfully.",
          dataSchema: { type: "object", properties: { message: { $ref: "#/components/schemas/ContactMessage" } } },
          example: { message: { id: "1", name: "Amina Yusuf", status: "resolved" } },
        }),
      },
    },
  },
  "/inquiries/sponsorships": {
    post: {
      tags: ["Inquiries"],
      summary: "Submit sponsorship request",
      requestBody: jsonBody(sponsorshipBody, {
        name: "David Cole",
        email: "david@brand.com",
        organization: "BuildSpace Africa",
        message: "We would like to sponsor the annual alumni summit.",
      }),
      responses: {
        201: successResponse({
          description: "Sponsorship request submitted successfully.",
          dataSchema: { type: "object", properties: { sponsorship: { $ref: "#/components/schemas/Sponsorship" } } },
          example: { sponsorship: { id: "1", name: "David Cole", status: "new" } },
        }),
      },
    },
    get: {
      tags: ["Inquiries"],
      summary: "List sponsorship requests for admin",
      security: [{ bearerAuth: [] }],
      parameters: adminQueryParams(["new", "contacted", "closed"]),
      responses: {
        200: successResponse({
          description: "Sponsorship requests fetched successfully.",
          dataSchema: { type: "array", items: { $ref: "#/components/schemas/Sponsorship" } },
          metaSchema: listMetaSchema,
          metaExample: listMetaExample,
          example: [{ id: "1", name: "David Cole", status: "new" }],
        }),
      },
    },
  },
  "/inquiries/sponsorships/{id}/status": {
    patch: {
      tags: ["Inquiries"],
      summary: "Update sponsorship status",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      requestBody: jsonBody(statusBody(["new", "contacted", "closed"], "contacted"), { status: "contacted" }),
      responses: {
        200: successResponse({
          description: "Sponsorship status updated successfully.",
          dataSchema: { type: "object", properties: { sponsorship: { $ref: "#/components/schemas/Sponsorship" } } },
          example: { sponsorship: { id: "1", name: "David Cole", status: "contacted" } },
        }),
      },
    },
  },
  "/settings/public": {
    get: {
      tags: ["Settings"],
      summary: "Get public settings",
      responses: {
        200: successResponse({
          description: "Public settings fetched successfully.",
          dataSchema: { type: "object", properties: { settings: { $ref: "#/components/schemas/Setting" } } },
          example: { settings: { siteName: "IFASA Alumni Network", enableDonations: true } },
        }),
      },
    },
  },
  "/settings": {
    get: {
      tags: ["Settings"],
      summary: "Get admin settings",
      security: [{ bearerAuth: [] }],
      responses: {
        200: successResponse({
          description: "Settings fetched successfully.",
          dataSchema: { type: "object", properties: { settings: { $ref: "#/components/schemas/Setting" } } },
          example: { settings: { siteName: "IFASA Alumni Network", allowRegistrations: true } },
        }),
      },
    },
    patch: {
      tags: ["Settings"],
      summary: "Update settings",
      security: [{ bearerAuth: [] }],
      requestBody: jsonBody(settingsBody, { siteName: "IFASA Alumni Network", allowRegistrations: true, enableDonations: true }),
      responses: {
        200: successResponse({
          description: "Settings updated successfully.",
          dataSchema: { type: "object", properties: { settings: { $ref: "#/components/schemas/Setting" } } },
          example: { settings: { siteName: "IFASA Alumni Network", enableDonations: true } },
        }),
      },
    },
  },
  "/dashboard/home": {
    get: {
      tags: ["Dashboard"],
      summary: "Get public homepage dashboard data",
      responses: {
        200: successResponse({
          description: "Public homepage data fetched successfully.",
          dataSchema: {
            type: "object",
            properties: {
              featuredEvents: { type: "array", items: { $ref: "#/components/schemas/Event" } },
              featuredOpportunities: { type: "array", items: { $ref: "#/components/schemas/Opportunity" } },
              spotlightAlumni: { type: "array", items: { $ref: "#/components/schemas/User" } },
              latestNews: { type: "array", items: { $ref: "#/components/schemas/News" } },
              stats: {
                type: "object",
                properties: {
                  registeredAlumni: { type: "integer" },
                  countriesRepresented: { type: "integer" },
                  mentorsAvailable: { type: "integer" },
                  activeEvents: { type: "integer" },
                },
              },
            },
          },
          example: {
            spotlightAlumni: [{ id: "1", fullName: "Tunde Adebayo" }],
            latestNews: [{ id: "1", title: "IFASA Alumni Spotlight Series Launches" }],
            featuredEvents: [{ id: "1", title: "IFASA Global Reunion 2026" }],
            featuredOpportunities: [{ id: "1", title: "Graduate Architect" }],
            stats: { registeredAlumni: 1200, countriesRepresented: 20, mentorsAvailable: 100, activeEvents: 8 },
          },
        }),
      },
    },
  },
  "/dashboard/admin": {
    get: {
      tags: ["Dashboard"],
      summary: "Get admin dashboard data",
      security: [{ bearerAuth: [] }],
      responses: {
        200: successResponse({
          description: "Admin dashboard fetched successfully.",
          dataSchema: {
            type: "object",
            properties: {
              metrics: {
                type: "object",
                properties: {
                  registeredAlumni: { type: "integer" },
                  upcomingEvents: { type: "integer" },
                  activeOpportunities: { type: "integer" },
                  donationsReceived: { type: "number" },
                },
              },
              recentActivities: { type: "array", items: { type: "object" } },
              latestOpportunities: { type: "array", items: { type: "object" } },
            },
          },
          example: {
            metrics: { registeredAlumni: 120, upcomingEvents: 8, activeOpportunities: 11, donationsReceived: 1000000 },
            recentActivities: [{ action: "auth.google-login", description: "User authenticated with Google." }],
            latestOpportunities: [{ id: "1", title: "Graduate Architect" }],
          },
        }),
      },
    },
  },
};
