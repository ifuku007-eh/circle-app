import express from "express"
import { addComment } from "../controllers/comment.controller"

const router = express.Router()

router.post("/", addComment)

export default router