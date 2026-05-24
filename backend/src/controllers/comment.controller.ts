import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const addComment = async (req: AuthRequest, res: Response) => {
  const { content, image, postId } = req.body;

  if (!content && !image) {
    return res.status(400).json({ message: "Komentar tidak boleh kosong" });
  }

  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
    include: { author: true },
  });

  if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

  const comment = await prisma.comment.create({
    data: {
      content,
      image,
      postId: Number(postId),
      userId: req.user!.id,
    },
    include: {
      user: true,
    },
  });

  const fromUser = await prisma.user.findUnique({
    where: { id: req.user!.id },
  });

  if (post.authorId !== req.user!.id) {
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        fromUserId: req.user!.id,
        postId: post.id,
        type: "comment",
        message: `${fromUser?.name || "Seseorang"} mengomentari postingan kamu`,
      },
    });
  }

  res.json(comment);
};

export const getCommentsByPost = async (req: AuthRequest, res: Response) => {
  const postId = Number(req.params.postId);

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  res.json(comments);
};