import { Post } from '../models/post.js';

// function to create a new post - NEW POST
export const newPost = async (req, res) => {
  const post = new Post(req.body);

  try {
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

// function to fetch all posts from database - ALL POST
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ title: 'desc' });

    // if no posts are found
    if (!posts) {
      return res.status(404).send();
    }

    res.send(posts);
  } catch (error) {
    res.status(500).send();
  }
};

// function to fetch individual post by ID - POST BY ID
export const getPostById = async (req, res) => {
  const _id = req.params.id;

  try {
    // filters by _id
    const post = await Post.findById({ _id });

    // if no post is found
    if (!post) {
      return res.status(404).send();
    }

    res.send(post);
  } catch (error) {
    res.status(500).send();
  }
};

// function to update a post by id - UPDATE POST
export const updatePostById = async (req, res) => {
  try {
    const _id = req.params.id;
    const post = await Post.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    // is no post is found
    if (!post) {
      return res.status(404).send();
    }

    // send updated post back to client
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

// function to delete a post by ID - DELETE POST
export const deletePostById = async (req, res) => {
  try {
    // find and delete post that takes id into account
    const post = await Post.findByIdAndDelete({
      _id: req.params.id,
    });

    // if no post is found
    if (!post) {
      res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    res.status(500).send();
  }
};

// function to count all posts - POST COUNT
export const getPostCount = async (req, res) => {
  try {
    // count all posts within database
    const postCount = await Post.countDocuments({});

    // console type check
    console.log(typeof postCount);
  
    // if no posts are found
    if (!postCount) {
      return res.status(404).send();
    }

    res.send(postCount);
  } catch (error) {
    res.status(500).send();
  }
};

// function to get the 5 most recently create posts
export const getRecentlyCreatedPosts = async (req, res) => {
  try {
    const mostRecentPosts = await Post.find({}).limit(5);

    if (!mostRecentPosts) {
      return res.status(404).send();
    }
    res.send(mostRecentPosts);
  } catch (error) {
    res.status(500).send();
  }
};
