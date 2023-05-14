import mongoose from 'mongoose';

// create the issue schema
const issueSchema = new mongoose.Schema();

// create the issue model
const Issue = mongoose.model('Issue', issueSchema);

// export the issue model
export { Issue };
