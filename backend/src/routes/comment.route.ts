import express from "express";
import {
  addComment,
  getCommentsByPost,
} from "../controllers/comment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticate, addComment);
router.get("/:postId", authenticate, getCommentsByPost);

export default router;