import Post from "../models/posts.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Post
const createPost = asyncHandler(async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post_id: post._id, post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get all posts
const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get single post
const getPostById = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update post
const updatePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// delete post
const deletePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default { createPost, getAllPosts, getPostById, updatePost, deletePost };
