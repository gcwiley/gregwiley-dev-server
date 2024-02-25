// THIS IS THE CODE TO USE IN THE FUTURE!
// TODO: FIGURE THIS OUT!

import mongoose from 'mongoose';
const { Schema } = mongoose;

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
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    comments: [{ body: String, date: Date }],
    date: {
      type: Date,
      default: Date.now,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    meta: {
      votes: Number,
      favs: Number,
    },
  },
  {
    timestamps: true,
  }
);

// create the post model
const Post = mongoose.model('Post', postSchema);

// export the post model
export { Post };