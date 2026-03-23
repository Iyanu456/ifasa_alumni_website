import fs from "fs";
import multer from "multer";
import path from "path";
import { uploadsDirectory } from "../utils/file.js";
import env from "../config/env.js";
import ApiError from "../utils/api-error.js";

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDirectory);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname) || ".jpg";
    const baseName = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    callback(null, `${Date.now()}-${baseName || "upload"}${extension}`);
  },
});

const fileFilter = (_req, file, callback) => {
  if (!file.mimetype.startsWith("image/")) {
    callback(new ApiError(400, "Only image uploads are allowed.", "INVALID_FILE_TYPE"));
    return;
  }

  callback(null, true);
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.maxFileSizeBytes,
  },
});

export const singleImageUpload = (
  fieldNames = ["image", "coverImage", "file", "photo"],
) => {
  const middleware = uploadImage.fields(
    fieldNames.map((name) => ({
      name,
      maxCount: 1,
    })),
  );

  return (req, res, next) => {
    middleware(req, res, (error) => {
      if (error) {
        next(error);
        return;
      }

      if (!req.file && req.files) {
        const firstFile = Object.values(req.files).flat()[0];

        if (firstFile) {
          req.file = firstFile;
        }
      }

      next();
    });
  };
};
