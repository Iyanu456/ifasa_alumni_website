export const sendSuccess = (
  res,
  {
    statusCode = 200,
    message = "Request completed successfully.",
    data = null,
    meta = null,
  } = {},
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    error: null,
    ...(meta ? { meta } : {}),
  });
};
