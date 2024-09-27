import { Router } from "express";

const router = Router();
import commentController from "../controllers/comment.controller.js";

router.post("/comments", commentController.createComment);

router.get("/allcomments/", commentController.getAllCommentByPostId);

router.get("/comments/:id", commentController.getCommentById);

router.put("/updatecomments/:id", commentController.updateComment);

router.delete("/deletecomments/:id", commentController.deleteComment);

export default router;
