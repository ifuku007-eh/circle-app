import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth.middleware'

const prisma = new PrismaClient()

export const getThreads = async (req: AuthRequest, res: Response) => {
  try {
    const threads = await prisma.thread.findMany({
      include: {
        author: { select: { id: true, username: true, full_name: true, photo_profile: true } },
        _count: { select: { likes: true, replies: true } }
      },
      orderBy: { created_at: 'desc' }
    })
    res.json(threads)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

export const createThread = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : null

    const thread = await prisma.thread.create({
      data: { content, image, created_by: req.userId! },
      include: {
        author: { select: { id: true, username: true, full_name: true, photo_profile: true } }
      }
    })
    res.status(201).json(thread)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

export const likeThread = async (req: AuthRequest, res: Response) => {
  try {
    const threadId = parseInt(req.params.id as string)
    const existing = await prisma.like.findFirst({
      where: { user_id: req.userId!, thread_id: threadId }
    })

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } })
      return res.json({ liked: false })
    }

    await prisma.like.create({
      data: { user_id: req.userId!, thread_id: threadId, created_by: req.userId! }
    })
    res.json({ liked: true })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getThreadDetail = async (req: AuthRequest, res: Response) => {
  try {
    const thread = await prisma.thread.findUnique({
      where: { id: parseInt(req.params.id as string) },
      include: {
        author: { select: { id: true, username: true, full_name: true, photo_profile: true } },
        replies: {
          include: {
            user: { select: { id: true, username: true, full_name: true, photo_profile: true } }
          }
        },
        _count: { select: { likes: true } }
      }
    })
    res.json(thread)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}