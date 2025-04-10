import mongoose from 'mongoose';
const { Schema } = mongoose;

// create the post schema
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required.'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters.'],
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Post body cannot be empty.'],
      trim: true,
    },
    meta: {
      votes: Number,
      favs: Number,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt timestamps automatically
  }
);

// create the post model
const Post = mongoose.model('Post', postSchema);

// export the post model
export { Post };
