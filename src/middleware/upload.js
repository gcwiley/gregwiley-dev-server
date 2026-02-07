import multer from 'multer';
import { }

// configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // store file in memory
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  // security: Validate that the uploaded file is actually an image
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'), false);
    }
  },
});

export { upload };
