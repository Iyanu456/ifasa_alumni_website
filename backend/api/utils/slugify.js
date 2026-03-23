const basicSlugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

export const createUniqueSlug = async (Model, value, currentId = null) => {
  const baseSlug = basicSlugify(value) || "item";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };

    if (currentId) {
      query._id = { $ne: currentId };
    }

    // eslint-disable-next-line no-await-in-loop
    const existing = await Model.findOne(query).select("_id");

    if (!existing) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
};
