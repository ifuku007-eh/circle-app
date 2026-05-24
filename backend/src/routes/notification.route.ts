import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getNotifications,
  markNotificationsRead,
} from "../controllers/notification.controller";

const router = express.Router();

router.get("/", authenticate, getNotifications);
router.put("/read", authenticate, markNotificationsRead);

export default router;