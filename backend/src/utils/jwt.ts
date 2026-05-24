import jwt from "jsonwebtoken"

export const generateAccessToken = (user: any) => {
  return jwt.sign(
    {
      userId: user.id
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  )
}

export const generateRefreshToken = () => {
  return Math.random().toString(36).substring(2)
}