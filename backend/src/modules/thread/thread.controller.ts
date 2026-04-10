import { Request, Response } from "express"
import { getThreadsService, createThreadService } from "./thread.service"

export const getThreads = async (req: Request, res: Response) => {
  try {
    const data = await getThreadsService()

    res.json({
      status: "success",
      data,
    })
  } catch {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch threads",
    })
  }
}

export const createThreadController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user

    const thread = await createThreadService(
      req.body.content,
      user.id,
      req.body.image
    )

    res.json({
      status: "success",
      data: thread,
    })
  } catch {
    res.status(500).json({
      status: "error",
      message: "Failed to create thread",
    })
  }
}