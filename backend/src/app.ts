import express from "express";
import cors from "cors";
import passport from "./config/passport";

import authRoutes from "./routes/auth.route";
import postRoutes from "./routes/post.route";
import commentRoutes from "./routes/comment.route";
import likeRoutes from "./routes/like.route";
import uploadRoutes from "./routes/upload.route";
import userRoutes from "./routes/user.route";
import followRoutes from "./routes/follow.route";
import notificationRoutes from "./routes/notification.route";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({ message: "Circle MLBB API running" });
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comment", commentRoutes);
app.use("/like", likeRoutes);
app.use("/upload", uploadRoutes);
app.use("/users", userRoutes);
app.use("/follow", followRoutes);
app.use("/notifications", notificationRoutes);

export default app;