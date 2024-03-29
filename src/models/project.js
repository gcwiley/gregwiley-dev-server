import mongoose from 'mongoose';
const { Schema } = mongoose;

// create the project schema
const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    gitUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// create the project model
const Project = mongoose.model('Project', projectSchema);

// export the project model
export { Project };
