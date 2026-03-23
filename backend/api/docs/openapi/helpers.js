export const successResponse = ({
  description,
  dataSchema,
  example,
  metaSchema,
  metaExample,
}) => ({
  description,
  content: {
    "application/json": {
      schema: {
        allOf: [
          { $ref: "#/components/schemas/StandardSuccessResponse" },
          {
            type: "object",
            properties: {
              data: dataSchema,
              ...(metaSchema ? { meta: metaSchema } : {}),
            },
          },
        ],
      },
      examples: {
        default: {
          value: {
            success: true,
            message: description,
            data: example,
            ...(metaExample ? { meta: metaExample } : {}),
            error: null,
          },
        },
      },
    },
  },
});

export const errorResponse = (
  description,
  example = {
    success: false,
    message: "Request failed.",
    data: null,
    error: {
      code: "BAD_REQUEST",
      details: null,
      requestId: "req_123456",
    },
  },
) => ({
  description,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
      examples: {
        default: {
          value: example,
        },
      },
    },
  },
});

export const jsonBody = (schemaRef, example) => ({
  required: true,
  content: {
    "application/json": {
      schema: schemaRef,
      examples: {
        default: {
          value: example,
        },
      },
    },
  },
});

export const jsonOrMultipartBody = (schemaRef, example) => ({
  required: true,
  content: {
    "application/json": {
      schema: schemaRef,
      examples: {
        default: {
          value: example,
        },
      },
    },
    "multipart/form-data": {
      schema: schemaRef,
    },
  },
});

export const listMetaSchema = { $ref: "#/components/schemas/PaginationMeta" };
export const listMetaExample = {
  page: 1,
  limit: 10,
  total: 1,
  totalPages: 1,
};

export const paginationParams = [
  { $ref: "#/components/parameters/PageParam" },
  { $ref: "#/components/parameters/LimitParam" },
  { $ref: "#/components/parameters/SortParam" },
  { $ref: "#/components/parameters/OrderParam" },
  { $ref: "#/components/parameters/SearchParam" },
];
