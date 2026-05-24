import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const toggleLike = async (req: AuthRequest, res: Response) => {
  const postId = Number(req.body.postId);
  const userId = req.user!.id;

  const existing = await prisma.like.findFirst({
    where: { postId, userId },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return res.json({ liked: false });
  }

  await prisma.like.create({
    data: { postId, userId },
  });

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  const fromUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (post && post.authorId !== userId) {
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        fromUserId: userId,
        postId,
        type: "like",
        message: `${fromUser?.name || "Seseorang"} menyukai postingan kamu`,
      },
    });
  }

  res.json({ liked: true });
};