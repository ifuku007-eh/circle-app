import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const createPost = async (req: AuthRequest, res: Response) => {
  const post = await prisma.post.create({
    data: {
      content: req.body.content,
      image: req.body.image,
      authorId: req.user!.id,
    },
    include: {
      author: true,
      likes: true,
      comments: true,
    },
  });

  res.json(post);
};

export const getPosts = async (_req: AuthRequest, res: Response) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      likes: true,
      comments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(posts);
};

export const getPostDetail = async (req: AuthRequest, res: Response) => {
  const postId = Number(req.params.id);

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      likes: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

  res.json(post);
};