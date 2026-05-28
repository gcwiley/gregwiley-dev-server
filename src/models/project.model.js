import mongoose from 'mongoose';
const { Schema } = mongoose;

// configuration object for project enums
const projectEnums = {
  status: ['not-started', 'in-development', 'completed', 'archived'],
  category: ['tutorial', 'personal-project', 'arc-gis-project'],
  language: ['JavaScript', 'Python', 'Dart'], // keep languages defined here.
};

// reusable URL validator function (more robust)
const isValidUrl = (url) => {
  // allow empty strings or null/undefined to pass validation
  if (!url) {
    return true;
  }
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

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
      required: [true, 'Start date is required.'],
      default: Date.now,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: 'Start date cannot be in the future.',
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
    // project description
    description: {
      type: String,
      trim: true,
      required: [true, 'Description is required.'],
      maxlength: [1000, 'Description cannot exceed 1000 characters.'],
    },
    // favorite
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);

export { Project };
