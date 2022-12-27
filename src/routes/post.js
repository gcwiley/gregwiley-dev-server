import express from 'express';

// Define a new router
const router = new express.Router();

// import the post controller
import {
  newPost,
  getPosts,
  getPostById,
  updatePostById,
  deletePostById,
} from '../controllers/post.js';

// Route handler to create a new post - NEW POST
router.post('/api/posts', newPost);

// Route handler for fetching all posts - GET ALL POSTS
router.get('/api/posts', getPosts);

// Route handler to fetch individual post by ID
router.get('/api/posts/:id', getPostById);

// Route handler to update an existing post - UPDATE POST by Id
router.patch('/api/posts/:id', updatePostById);

// Route handler to delete a post by ID - DELETE POST by Id
router.delete('/api/posts/:id', deletePostById);

// export the router
export { router as postRouter };
