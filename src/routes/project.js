import { Router } from 'express';
const router = Router();

// project controller functions
import {
  newProject,
  getProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  getProjectCount,
  getRecentlyCreatedProjects,
  searchProjects,
} from '../controllers/project.js';

// GET /api/projects/count - count all projects
router.get('/count', getProjectCount);

// GET /api/projects/recent - get recent projects
router.get('/recent', getRecentlyCreatedProjects);

// GET /api/projects/search - search projects
router.get('/search', searchProjects);

// GET /api/projects - get all projects
router.get('/', getProjects);

// GET /api/projects/:id - get project by ID
// (must come after specific routes like 'count' or 'recent')
router.get('/:id', getProjectById);

// POST /api/projects - create new project
router.post('/', newProject);

// PATCH /api/projects/:id - update project
router.patch('/:id', updateProjectById);

// DELETE /api/projects/:id - delete project
router.delete('/:id', deleteProjectById);

export { router as projectRouter };
