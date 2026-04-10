import { Router } from "express"
import { getThreads, createThreadController } from "./thread.controller"
import { authenticate } from "../../middlewares/auth.middleware"

const router = Router()

router.get("/", getThreads)
router.post("/", authenticate, createThreadController)

export default router