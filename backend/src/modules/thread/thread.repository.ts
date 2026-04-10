import prisma from "../../config/prisma";

export const createThread = async (data: any) => {
  return prisma.thread.create({
    data,
    include: {
      author: true,
      _count: {
        select: {
          likes: true,
          replies: true
        }
      }
    }
  })
}