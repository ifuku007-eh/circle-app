import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getMe,
  updateProfile,
  getUserProfile,
  searchUsers,
  getSuggestions,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateProfile);
router.get("/search", authenticate, searchUsers);
router.get("/suggestions", authenticate, getSuggestions);
router.get("/:id", authenticate, getUserProfile);

export default router;