import path from 'path';
import { Image } from '../models/image.js';

// NEW IMAGE
export const newImage = async (req, res) => {
  try {
  } catch (error) {}
};

// GET ALL IMAGES
export const getImages = async (req, res) => {
  try {
    // fetch images from the database
    const images = await Image.find({}).lean();

    // if no images are found
    if (images.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: 'No images found.' });
    }
  } catch (error) {
    // fix this!
  }
};

// UPLOAD IMAGE


// GET IMAGE COUNT
export const getImageCount = async (req, res) => {
  try {
    const imageCount = await Image.countDocuments({});

    res
      .status(200)
      .json({ success: true, message: 'Image count', data: imageCount });
  } catch (error) {}
};
