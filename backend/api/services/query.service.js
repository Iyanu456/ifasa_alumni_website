const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getPaginationParams = (query = {}) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

export const getSortParams = (
  query = {},
  allowedFields = [],
  defaultField = "createdAt",
  defaultOrder = "desc",
) => {
  let field = defaultField;
  let direction = defaultOrder === "asc" ? 1 : -1;

  if (query.sort) {
    const providedField = String(query.sort).replace(/^-/, "");

    if (allowedFields.includes(providedField)) {
      field = providedField;
      direction = String(query.sort).startsWith("-") ? -1 : 1;
    }
  }

  if (query.order) {
    direction = String(query.order).toLowerCase() === "asc" ? 1 : -1;
  }

  return { [field]: direction };
};

export const buildSearchFilter = (search, fields = []) => {
  if (!search || fields.length === 0) {
    return null;
  }

  const pattern = new RegExp(escapeRegex(String(search).trim()), "i");

  return {
    $or: fields.map((field) => ({
      [field]: pattern,
    })),
  };
};

export const listDocuments = async ({
  model,
  query = {},
  filter = {},
  searchFields = [],
  allowedSortFields = [],
  defaultSortField = "createdAt",
  defaultOrder = "desc",
  populate = null,
  select = null,
}) => {
  const pagination = getPaginationParams(query);
  const sort = getSortParams(query, allowedSortFields, defaultSortField, defaultOrder);
  const searchFilter = buildSearchFilter(query.search, searchFields);
  const finalFilter = searchFilter ? { $and: [filter, searchFilter] } : filter;

  let documentsQuery = model
    .find(finalFilter)
    .sort(sort)
    .skip(pagination.skip)
    .limit(pagination.limit);

  if (populate) {
    documentsQuery = documentsQuery.populate(populate);
  }

  if (select) {
    documentsQuery = documentsQuery.select(select);
  }

  const [documents, total] = await Promise.all([
    documentsQuery.lean(),
    model.countDocuments(finalFilter),
  ]);

  return {
    documents,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.max(Math.ceil(total / pagination.limit), 1),
    },
  };
};
