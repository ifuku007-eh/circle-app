import { Response } from 'express'

export const successResponse = (
  res: Response,
  message: string,
  data?: any,
  code: number = 200
) => {
  return res.status(code).json({
    code,
    status: 'success',
    message,
    data
  })
}

export const errorResponse = (
  res: Response,
  message: string,
  code: number = 500
) => {
  return res.status(code).json({
    code,
    status: 'error',
    message
  })
}