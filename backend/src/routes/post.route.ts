import express from "express";
import {
  createPost,
  getPosts,
  getPostDetail,
} from "../controllers/post.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticate, getPosts);
router.post("/", authenticate, createPost);
router.get("/:id", authenticate, getPostDetail);

export default router;