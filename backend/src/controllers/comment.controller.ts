import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const addComment = async (req: any, res: any) => {
  const comment = await prisma.comment.create({
    data: {
      content: req.body.content,
      postId: req.body.postId,
      userId: req.user.id,
    },
  })

  res.json(comment)
}