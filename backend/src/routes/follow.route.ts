import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { toggleFollow } from "../controllers/follow.controller";

const router = express.Router();

router.post("/:id", authenticate, toggleFollow);

export default router;