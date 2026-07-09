import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const getMe = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatar: true,
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });

  res.json(user);
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { name, bio, avatar } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, bio, avatar },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatar: true,
    },
  });

  res.json(user);
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  const currentUserId = req.user!.id;
  const userId = Number(req.params.id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatar: true,
      posts: {
        include: {
          author: true,
          likes: true,
          comments: true,
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });

  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  const isFollowing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: userId,
      },
    },
  });

  res.json({ ...user, isFollowing: !!isFollowing });
};

export const searchUsers = async (req: AuthRequest, res: Response) => {
  const currentUserId = req.user!.id;
  const q = String(req.query.q || "");

  const users = await prisma.user.findMany({
    where: {
      id: { not: currentUserId },
      name: { contains: q, mode: "insensitive" },
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
    take: 10,
  });

  res.json(users);
};

export const getSuggestions = async (req: AuthRequest, res: Response) => {
  const currentUserId = req.user!.id;

  const following = await prisma.follow.findMany({
    where: { followerId: currentUserId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);

  if (followingIds.length === 0) {
    return res.json([]);
  }

  // Users followed by people the current user follows (2nd-degree connections),
  // excluding the current user and people already followed.
  const secondDegree = await prisma.follow.findMany({
    where: {
      followerId: { in: followingIds },
      followingId: { notIn: [currentUserId, ...followingIds] },
    },
    select: { followingId: true },
  });

  const suggestionIds = [...new Set(secondDegree.map((f) => f.followingId))];

  if (suggestionIds.length === 0) {
    return res.json([]);
  }

  const users = await prisma.user.findMany({
    where: { id: { in: suggestionIds } },
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
    },
    take: 5,
  });

  res.json(users);
};

export const getPeopleYouMayKnow = async (req: AuthRequest, res: Response) => {
  const currentUserId = req.user!.id;

  const following = await prisma.follow.findMany({
    where: { followerId: currentUserId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);

  let connectedIds: number[] = [];

  if (followingIds.length > 0) {
    const secondDegree = await prisma.follow.findMany({
      where: { followerId: { in: followingIds } },
      select: { followingId: true },
    });

    connectedIds = secondDegree.map((f) => f.followingId);
  }

  // Exclude the current user, everyone they already follow, and anyone
  // connected through people they follow — only fully unconnected users remain.
  const excludeIds = [
    ...new Set([currentUserId, ...followingIds, ...connectedIds]),
  ];

  const users = await prisma.user.findMany({
    where: {
      id: { notIn: excludeIds },
    },
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
    },
    take: 5,
  });

  res.json(users);
};

export const getFollowers = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.id);

  const followers = await prisma.follow.findMany({
    where: {
      followingId: userId,
    },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          bio: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(followers);
};

export const getFollowing = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.id);

  const following = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          bio: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(following);
};