import mongoose from 'mongoose';
const { Schema } = mongoose;

// create the post schema
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required.'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters long.'],
      maxlength: [150, 'Title cannot exceed 150 characters.'],
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required.'],
      idex: true,
    },
    body: {
      type: String,
      required: [true, 'Post body cannot be empty.'],
      trim: true,
      minlength: [10, 'Post body must be at least 10 characters long.']
    },
    meta: {
      votes: {
        type: Number,
        default: 0, // default votes to 0
        min: [0, 'Votes cannot be negative.'], // ensure votes are not negative
      },
      favorites: {
        type: Number,
        default: 0, // default favorites to 0
        min: [0, 'Favs cannot be negative.']
      }
    },
  },
  {
    timestamps: true,
  }
);

// compound indexes - searching by author and timestamp
postSchema.index({ author: 1, createdAt: -1 });

// create the post model
const Post = mongoose.model('Post', postSchema);

// export the post model
export { Post };
