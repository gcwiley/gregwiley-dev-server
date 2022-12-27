import express from 'express';

// Define a new router
const router = new express.Router();

// import the project controller
import {
  newProject,
  getProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  getProjectCount,
  getRecentlyCreatedProjects,
} from '../controllers/project.js';

// Route handler to create a new Project - NEW PROJECT
router.post('/api/projects', newProject);

// Route handler for fetching all projects - GET ALL PROJECTS
router.get('/api/projects', getProjects);

// Route handler to fetch individual project by ID
router.get('/api/projects/:id', getProjectById);

// Route handler to update an existing project - UPDATE PROJECT by Id
router.patch('/api/projects/:id', updateProjectById);

// Route handler to delete a project by ID - DELETE PROJECT by Id
router.delete('/api/projects/:id', deleteProjectById);

// Route handler to count all projects in database - COUNT PROJECTS
router.get('/api/project-count', getProjectCount);

// Route handler to get the last 5 project created - LAST 5 PROJECTS
router.get('/api/recent-projects', getRecentlyCreatedProjects);

// export the router
export { router as projectRouter };
