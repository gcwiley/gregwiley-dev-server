import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed.'), false);
    }
  },
});

/**
 * Validates the actual file content by inspecting magic bytes.
 * Call this after multer has processed the upload.
 */
async function validateFileContent(req, _res, next) {
  if (!req.file) {
    return next();
  }

  try {
    const detected = await fileTypeFromBuffer(req.file.buffer);

    if (!detected || !ALLOWED_MIME_TYPES.includes(detected.mime)) {
      const err = new Error('File content does not match an allowed image type.');
      err.status = 400;
      return next(err);
    }

    // overwrite the client-provided mimetype with the verified one
    req.file.mimetype = detected.mime;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Error-handling middleware for multer errors.
 * Mount after your upload routes.
 */
function handleUploadError(err, _req, res, next) {
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
      LIMIT_FILE_COUNT: 'Too many files. Only one file is allowed.',
      LIMIT_UNEXPECTED_FILE: 'Unexpected field name for file upload.',
    };
    return res.status(400).json({
      error: messages[err.code] || err.message,
    });
  }

  if (err.message && err.message.includes('images are allowed')) {
    return res.status(400).json({ error: err.message });
  }

  next(err);
}

export { upload, validateFileContent, handleUploadError, ALLOWED_MIME_TYPES };