import express from "express"
import { createPost, getPosts } from "../controllers/post.controller"

const router = express.Router()

router.post("/", createPost)
router.get("/", getPosts)

export default router