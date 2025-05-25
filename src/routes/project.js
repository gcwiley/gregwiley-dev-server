import express from 'express';

const router = new express.Router();

// project controller functions
import {
  newProject,
  getProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  getProjectCount,
  getRecentlyCreatedProjects,
  getFavoriteProjects,
} from '../controllers/project.js';

// route handler to create a new Project - POST NEW PROJECT
router.post('/api/projects', newProject);

// route handler for fetching all projects - GET ALL PROJECTS
router.get('/api/projects', getProjects);

// route handler to fetch individual project - GET PROJECT BY ID
router.get('/api/projects/:id', getProjectById);

// route handler to update an existing project - UPDATE PROJECT BY ID
router.patch('/api/projects/:id', updateProjectById);

// route handler to delete a project by ID - DELETE PROJECT BY ID
router.delete('/api/projects/:id', deleteProjectById);

// route handler to count all projects in database - COUNT ALL PROJECTS
router.get('/api/projects/count', getProjectCount);

// route handler to get the last 5 project created - GET 5 RECENT PROJECTS
router.get('/api/projects/recent', getRecentlyCreatedProjects);

// route handler to get the favorite projects
router.get('/api/projects/favorites', getFavoriteProjects);

export { router as projectRouter };
