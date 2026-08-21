const fs = require("fs");
const path = require("path");
const multer = require("multer");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "resumes");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, uniqueName);
  },
});

function fileFilter(_req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();

  const isAllowedType =
    ALLOWED_MIME_TYPES.includes(file.mimetype) &&
    ALLOWED_EXTENSIONS.includes(extension);

  if (isAllowedType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, DOC, and DOCX files are allowed.",
      ),
      false,
    );
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

function handleUploadError(error, _req, res, next) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File is too large. Maximum allowed size is 5 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next();
}

module.exports = {
  uploadResume: upload.single("resume"),
  handleUploadError,
};
