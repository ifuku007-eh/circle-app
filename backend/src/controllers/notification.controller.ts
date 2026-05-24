import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const getNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  res.json(notifications);
};

export const markNotificationsRead = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  await prisma.notification.updateMany({
    where: { userId },
    data: { read: true },
  });

  res.json({ message: "Notifikasi sudah dibaca" });
};