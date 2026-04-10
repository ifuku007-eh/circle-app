import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middlewares/auth.middleware";
import { successResponse, errorResponse } from "../utils/response";

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.post("/", async (req: AuthRequest, res) => {
  try {
    const { thread_id, content } = req.body;
    const reply = await prisma.reply.create({
      data: {
        user_id: req.user.id,
        thread_id,
        content,
        created_by: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            full_name: true,
            photo_profile: true,
          },
        },
      },
    });
    await prisma.thread.update({
      where: { id: thread_id },
      data: { number_of_replies: { increment: 1 } },
    });
    return successResponse(res, "Reply berhasil ditambahkan", reply, 201);
  } catch {
    return errorResponse(res, "Gagal menambahkan reply");
  }
});

export default router;
