import fs from "fs/promises";
import path from "path";

export const uploadsDirectory = path.resolve(process.cwd(), "uploads");

export const buildFileUrl = (req, file) => {
  if (!file) {
    return null;
  }

  return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
};

export const deleteLocalFileByUrl = async (fileUrl) => {
  if (!fileUrl) {
    return;
  }

  try {
    const parsedUrl = new URL(fileUrl, "http://localhost");

    if (!parsedUrl.pathname.startsWith("/uploads/")) {
      return;
    }

    const filename = path.basename(parsedUrl.pathname);
    const absolutePath = path.join(uploadsDirectory, filename);

    await fs.unlink(absolutePath);
  } catch {
    // Intentionally ignore cleanup failures.
  }
};
