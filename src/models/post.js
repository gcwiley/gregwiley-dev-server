import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// create the post schema
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    datePosted: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// create the issue model
const Post = mongoose.model('Post', postSchema);

// export the issue model
export { Post };




