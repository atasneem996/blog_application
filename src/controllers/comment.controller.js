import Comment from "../models/comments.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";

// create cooment
const createComment = asyncHandler(async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get all comments for a post

const getAllCommentByPostId = asyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.query.post_id });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get single comment
const getCommentById = asyncHandler(async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(500).json({ error: "Comment not found" });
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update commment
const updateComment = asyncHandler(async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!comment) return res.status(200).json({ error: "Comment not found" });
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete comment

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.status(200).json({ error: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default {
  createComment,
  getAllCommentByPostId,
  getCommentById,
  updateComment,
  deleteComment,
};
