import express from "express"
import { toggleLike } from "../controllers/like.controller"

const router = express.Router()

router.post("/", toggleLike)

export default router