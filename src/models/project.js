import mongoose from 'mongoose';
const { Schema } = mongoose;

// create the project schema
const projectSchema = new Schema(
   {
      title: {
         type: String,
         required: true,
         trim: true,
         index: true, // improves query performance
      },
      status: {
         type: String,
         required: true,
         enum: ['active', 'completed', 'archived'],
         default: 'active', // default value
         index: true, // improves query performance
      },
      category: {
         type: String,
         required: true,
         enum: ['web', 'mobile', 'desktop'],
         default: 'web',
         index: true,
      },
      language: {
         type: String,
         required: true,
         enum: ['JavaScript', 'Python', 'Dart'],
         default: 'JavaScript',
      },
      startDate: {
         type: Date, // use Date for better date handling
      },
      liveUrl: {
         type: String,
         trim: true,
         validate: {
            validator: function (v) {
               return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
            },
            message: (props) => `${props.value} is not a valid URL.`,
         },
      },
      gitUrl: {
         type: String,
         trim: true,
         validate: {
            validator: function (v) {
               return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
            },
            message: (props) => `${props.value} is not a valid URL.`,
         },
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
