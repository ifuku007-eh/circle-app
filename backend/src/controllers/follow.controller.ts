import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const toggleFollow = async (req: AuthRequest, res: Response) => {
  const followerId = req.user!.id;
  const followingId = Number(req.params.id);

  if (followerId === followingId) {
    return res.status(400).json({ message: "Tidak bisa follow diri sendiri" });
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: followingId },
  });

  if (!targetUser) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });

    const updatedTarget = await prisma.user.findUnique({
      where: { id: followingId },
      select: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    return res.json({
      following: false,
      count: updatedTarget?._count,
    });
  }

  await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  const fromUser = await prisma.user.findUnique({
    where: { id: followerId },
  });

  await prisma.notification.create({
    data: {
      userId: followingId,
      fromUserId: followerId,
      type: "follow",
      message: `${fromUser?.name || "Seseorang"} mulai mengikuti kamu`,
    },
  });

  const updatedTarget = await prisma.user.findUnique({
    where: { id: followingId },
    select: {
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });

  return res.json({
    following: true,
    count: updatedTarget?._count,
  });
};