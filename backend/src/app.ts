import express from "express";
import cors from "cors";
import passport from "./config/passport";

import authRoutes from "./routes/auth.route";
import postRoutes from "./routes/post.route";
import commentRoutes from "./routes/comment.route";
import likeRoutes from "./routes/like.route";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({ message: "Circle MLBB API running" });
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comment", commentRoutes);
app.use("/like", likeRoutes);

export default app;