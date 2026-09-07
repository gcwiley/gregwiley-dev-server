import mongoose from 'mongoose';
import { projectEnums } from './project.constants.js';
import { isValidUrl } from '../utils/valid-url.js';
const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    // project title
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters.'],
      index: true,
      unique: true,
    },
    // project status
    status: {
      type: String,
      required: [true, 'Status is required.'],
      enum: {
        values: projectEnums.status,
        message: `Status must be one of: ${projectEnums.status.join(', ')}`,
      },
      default: 'not-started',
      index: true,
    },
    // project category
    category: {
      type: String,
      required: [true, 'Category is required.'],
      lowercase: true,
      index: true,
    },
    // tags
    tags: {
      type: [String],
      required: false,
      default: [],
      index: true,
    },
    // programming language
    programmingLanguage: {
      type: String,
      required: [true, 'Project Language is required.'],
      enum: {
        values: projectEnums.language,
        message: `Language must be one of: ${projectEnums.language.join(', ')}`,
      },
      default: 'JavaScript',
      index: true,
    },
    // project start date
    startDate: {
      type: Date,
      required: [true, 'A project start date is required.'],
      default: Date.now,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: 'The project start date cannot be in the future.',
      },
    },
    // Git Repo URL
    gitUrl: {
      type: String,
      trim: true,
      required: false,
      validate: {
        validator: isValidUrl,
        message: (props) => `${props.value} is not a valid URL.`,
      },
    },
    // project description for the project
    description: {
      type: String,
      trim: true,
      required: [true, 'Description is required.'],
      maxlength: [1000, 'Description cannot exceed 1000 characters.'],
    },
    // favorite flag for the project
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields.
  },
);

// Index for sorting projects by creation date in descending order.
projectSchema.index({ createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);

export { Project };
