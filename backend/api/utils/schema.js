export const applyCommonSchemaOptions = (schema, hiddenFields = []) => {
  const transform = (_doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;

    hiddenFields.forEach((field) => {
      delete ret[field];
    });

    return ret;
  };

  schema.set("toJSON", {
    virtuals: true,
    transform,
  });

  schema.set("toObject", {
    virtuals: true,
    transform,
  });
};
