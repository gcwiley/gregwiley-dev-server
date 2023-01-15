import mongoose from 'mongoose';
const { Schema } = mongoose;

// create the post schema
const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
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
});

// create the post Model
const Post = mongoose.model('Post', postSchema);

// export the post Model
export { Post };
