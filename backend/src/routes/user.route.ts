import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getMe,
  updateProfile,
  getUserProfile,
  searchUsers,
  getSuggestions,
  getPeopleYouMayKnow,
  getFollowers,
  getFollowing,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateProfile);
router.get("/search", authenticate, searchUsers);
router.get("/suggestions", authenticate, getSuggestions);
router.get("/people-you-may-know", authenticate, getPeopleYouMayKnow);

router.get("/:id/followers", authenticate, getFollowers);
router.get("/:id/following", authenticate, getFollowing);
router.get("/:id", authenticate, getUserProfile);

export default router;