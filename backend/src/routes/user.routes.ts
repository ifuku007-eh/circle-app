import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middlewares/auth.middleware";
import { successResponse, errorResponse } from "../utils/response";

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get("/me", async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        username: true,
        full_name: true,
        email: true,
        photo_profile: true,
        bio: true,
        _count: { select: { following: true, followers: true, threads: true } },
      },
    });
    return successResponse(res, "Data user berhasil diambil", user);
  } catch {
    return errorResponse(res, "Gagal mengambil data user");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        username: true,
        full_name: true,
        photo_profile: true,
        bio: true,
        threads: {
          include: { _count: { select: { likes: true, replies: true } } },
          orderBy: { created_at: "desc" },
        },
        _count: { select: { following: true, followers: true } },
      },
    });
    if (!user) return errorResponse(res, "User tidak ditemukan", 404);
    return successResponse(res, "Data user berhasil diambil", user);
  } catch {
    return errorResponse(res, "Gagal mengambil data user");
  }
});

router.post("/:id/follow", async (req: AuthRequest, res) => {
  try {
    const followingId = parseInt(req.params.id as string);
    const existing = await prisma.following.findFirst({
      where: { following_id: req.user?.id!, follower_id: followingId },
    });
    if (existing) {
      await prisma.following.delete({ where: { id: existing.id } });
      return successResponse(res, "Berhasil unfollow", { following: false });
    }
    await prisma.following.create({
      data: { following_id: req.user?.id!, follower_id: followingId },
    });
    return successResponse(res, "Berhasil follow", { following: true });
  } catch {
    return errorResponse(res, "Gagal follow/unfollow");
  }
});

export default router;
