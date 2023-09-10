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
  getPostCount,
  getRecentlyCreatedPosts
} from '../controllers/post.js';

// Route handler to create a new Post - NEW 
router.post('/api/posts', newPost);

// Route handler for fetching all posts - GET ALL POSTS
router.get('/api/posts', getPosts);

// Route handler to fetch individual post by ID
router.get('/api/posts/:id', getPostById);

// Route handler to update an existing post - UPDATE POST by Id
router.patch('/api/posts/:id', updatePostById);

// Route handler to delete a post by ID - DELETE POST by Id
router.delete('/api/posts/:id', deletePostById);

// Route handler to count all posts in database - COUNT POST
router.get('/api/post-count', getPostCount);

// Route handler to get the last 5 posts created - LAST 5 POSTS
router.get('/api/recent-posts', getRecentlyCreatedPosts);

// export the router
export { router as postRouter };