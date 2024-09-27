import { Router } from "express";

const router = Router();

// import postController from "../controllers/post.controller.js";

// router.post("/posts", postController.createPost);

import postController from "../controllers/post.controller.js";

router.post("/posts", postController.createPost);

router.get("/allposts", postController.getAllPosts);

router.get("/posts/:id", postController.getPostById);

router.put("/updateposts/:id", postController.updatePost);

router.delete("/deleteposts/:id", postController.deletePost);

export default router;
