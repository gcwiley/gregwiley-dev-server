import express from 'express';

// create a new router
const router = new express.Router();

import { newIssue, getIssues, deleteIssueById } from '../controllers/issue.js';

// Route handler to create a new issue - NEW ISSUE
router.post('/api/issues', newIssue);

// Route handler for fetching all issues - GET ALL ISSUES
router.get('/api/issues', getIssues);

// Route handler to delete a issue by Id - DELETE ISSUE
router.delete('/api/issues/:id', deleteIssueById);

// export the router to be used
export { router as issueRouter };