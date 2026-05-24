import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { uploadImage } from "../controllers/upload.controller";

const router = express.Router();

router.post("/", authenticate, upload.single("image"), uploadImage);

export default router;