import mongoose from 'mongoose';
const { Schema } = mongoose;

// configuration object for enums
const projectEnums = {
   status: ['active', 'completed', 'archived'],
   category: ['web', 'mobile', 'desktop'],
   language: ['JavaScript', 'Python', 'Dart'],
};

// reusable URL validator function (more robust)
const isValidUrl = (url) => {
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
      },
      // project status
      status: {
         type: String,
         required: true,
         enum: {
            values: projectEnums.status,
            message: `Status must be one of: ${projectEnums.status.join(', ')}`,
         },
         default: 'active', // default value
         index: true, // improves query performance
      },
      // project category
      category: {
         type: String,
         required: [true, 'Category is required.'],
         enum: {
            values: projectEnums.category,
            message: `Category must be one of: ${projectEnums.category.join(', ')}`,
         },
         default: 'web', // default value
         index: true,
      },
      // project language
      language: {
         type: String,
         required: true,
         enum: ['JavaScript', 'Python', 'Dart'],
         default: 'JavaScript',
      },
      // project start date
      startDate: {
         type: Date, // use Date for better date handling
         required: [true, 'Start date is required.'],
      },
      // URL of the live project
      liveUrl: {
         type: String,
         trim: true,
         validate: {
            validator: isValidUrl,
            message: (props) => `${props.value} is not a valid URL.`,
         },
      },
      // URL of the Git repository
      gitUrl: {
         type: String,
         trim: true,
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
      },
      // indicates if the project is a favorite
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
