import express from "express";
import { register, login } from "../controllers/auth.controller";
import passport from "../config/passport";
import { generateAccessToken } from "../utils/jwt";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: any, res) => {
    const token = generateAccessToken(req.user);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    res.redirect(`${frontendUrl}/oauth-success?token=${token}`);
  }
);

export default router;