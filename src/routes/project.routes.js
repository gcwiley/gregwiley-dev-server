import { Router } from 'express';
const router = Router();

// project controller functions
import {
  newProject,
  getPaginatedProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  getProjectCount,
  getRecentlyCreatedProjects,
  searchProjects,
} from '../controllers/project.controller.js';

// import auth middleware
import { authenticate } from '../middleware/auth.middleware.js';

// GET /api/projects/count - count all projects
router.get('/count', getProjectCount);

// GET /api/projects/recent - get recent projects
router.get('/recent', getRecentlyCreatedProjects);

// GET /api/projects/search - search projects
router.get('/search', searchProjects);

// GET /api/projects - get all projects
router.get('/', getPaginatedProjects);

// GET /api/projects/:id - get project by ID
router.get('/:id', getProjectById);

// POST /api/projects - create new project
router.post('/', authenticate, newProject);

// PATCH /api/projects/:id - update project
router.patch('/:id', authenticate, updateProjectById);

// DELETE /api/projects/:id - delete project
router.delete('/:id', authenticate, deleteProjectById);

export { router as projectRouter };
