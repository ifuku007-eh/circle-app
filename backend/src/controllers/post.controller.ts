import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const createPost = async (req: any, res: any) => {
  const post = await prisma.post.create({
    data: {
      content: req.body.content,
      image: req.body.image,
      authorId: req.user.id,
    },
  })

  res.json(post)
}

export const getPosts = async (_: any, res: any) => {
  const posts = await prisma.post.findMany({
    include: { author: true, likes: true },
    orderBy: { createdAt: "desc" },
  })

  res.json(posts)
}