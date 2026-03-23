const stripHtml = (value) =>
  value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\0/g, "")
    .trim();

const overwriteObject = (target, sanitizedValue) => {
  Object.keys(target).forEach((key) => {
    delete target[key];
  });

  Object.assign(target, sanitizedValue);
};

const sanitizeObject = (value) => {
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeObject(entry));
  }

  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !key.includes("$") && !key.includes("."))
        .map(([key, nestedValue]) => [key, sanitizeObject(nestedValue)]),
    );
  }

  if (typeof value === "string") {
    const sanitized = stripHtml(value);
    return sanitized === "" ? undefined : sanitized;
  }

  return value;
};

export const sanitizeInputs = (req, _res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.params) {
    overwriteObject(req.params, sanitizeObject(req.params));
  }

  if (req.query) {
    overwriteObject(req.query, sanitizeObject(req.query));
  }

  next();
};
