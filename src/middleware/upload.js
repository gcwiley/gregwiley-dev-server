import multer from 'multer';

// configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // store file in memory
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export { upload };
