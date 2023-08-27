import express from 'express';

// Define a new router
const router = new express.Router();

// import the project controller
import {
  newPost,
  getPosts,
  getPostById,
  updatePostById,
  deletePostById,
  getPostCount,
  getRecentlyCreatedPosts
} from '../controllers/post.js';

// Route handler to create a new Project - NEW PROJECT
router.post('/api/projects', newPost);

// Route handler for fetching all projects - GET ALL PROJECTS
router.get('/api/projects', getPosts);

// Route handler to fetch individual project by ID
router.get('/api/projects/:id', getPostById);

// Route handler to update an existing project - UPDATE PROJECT by Id
router.patch('/api/projects/:id', updatePostById);

// Route handler to delete a project by ID - DELETE PROJECT by Id
router.delete('/api/projects/:id', deletePostById);

// Route handler to count all projects in database - COUNT PROJECTS
router.get('/api/project-count', getPostCount);

// Route handler to get the last 5 project created - LAST 5 PROJECTS
router.get('/api/recent-projects', getRecentlyCreatedPosts);

// export the router
export { router as postRouter };