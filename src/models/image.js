import mongoose from 'mongoose';
const { Schema } = mongoose;

// create the image schema
const imageSchema = new Schema(
  {
    // reference to the user who uploaded the image
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // this should match the model name you defined in user.js
      required: [true, 'An image must belong to a user.'],
    },
    // public URL for accessing the image
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required.'],
    },
    // the name/path of the file in cloud storage bucket
    // this is useful if you ever need to delete or manage the file directly
    fileName: {
      type: String,
      required: [true, 'File name is required for management.'],
    },
    // optional title for the image
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters.'],
    },
    // optional description
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters.'],
    },
    // tags for searching (indexed for performance)
    tags: {
      type: [String],
      index: true,
    },
    // file technical metadata
    contentType: {
      type: String,
      required: [true, 'Content type is required.'],
    },
    size: {
      type: Number, // size in bytes
    },
    // the original name of the uploaded file
    originalName: {
      type: String,
    },
  },
  {
    // automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// create image model
const Image = mongoose.model('Image', imageSchema);

export { Image };