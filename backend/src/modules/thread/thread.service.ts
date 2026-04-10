import prisma from "../../config/prisma"

export const getThreadsService = async () => {
  return prisma.thread.findMany({
    include: {
      author: true,
      _count: {
        select: {
          likes: true,
          replies: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  })
}

export const createThreadService = async (
  content: string,
  userId: number,
  image?: string
) => {
  return prisma.thread.create({
    data: {
      content,
      image,
      author: {
        connect: {
          id: userId,
        },
      },
    },
  })
}