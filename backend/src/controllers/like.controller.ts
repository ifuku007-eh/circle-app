import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const toggleLike = async (req: any, res: any) => {
  const existing = await prisma.like.findFirst({
    where: { postId: req.body.postId, userId: req.user.id },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    return res.json({ liked: false })
  }

  await prisma.like.create({
    data: { postId: req.body.postId, userId: req.user.id },
  })

  res.json({ liked: true })
}