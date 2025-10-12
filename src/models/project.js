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

// create the project schema
const projectSchema = new Schema(
  {
    // project title
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters.'],
      index: true, // improves query performance
      unique: true, // titles must be unique
    },
    // project status
    status: {
      type: String,
      required: [true, 'Status is required.'],
      enum: {
        values: projectEnums.status,
        message: `Status must be one of: ${projectEnums.status.join(', ')}`,
      },
      default: 'not-started', // default value
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
      type: [String], // array of strings
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
      type: Date, // use Date for better date handling
      required: [true, 'Start date is required.'],
      default: Date.now, // sets the default date to now
      validate: {
        validator: function (value) {
          // value is the date being set
          return value <= new Date();
        },
        message: 'Start date cannot be in the future.',
      },
    },
    // URL of the Git repository
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
    // indicates if the project is a favorite
    favorite: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// index the createdAt field for sorting
projectSchema.index({ createdAt: -1 }); // -1 indicates descending order is common for this sort

// create the project model
const Project = mongoose.model('Project', projectSchema);

export { Project };
