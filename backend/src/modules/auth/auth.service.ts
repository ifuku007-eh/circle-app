import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {
  findUserByEmailOrUsername,
  findUserByEmail,
  createUser
} from "./auth.repository"

const JWT_SECRET = "secret123" // nanti bisa pakai env

export const registerService = async (data: any) => {
  const { full_name, username, email, password } = data

  const existing = await findUserByEmail(email)
  if (existing) throw new Error("Email sudah digunakan")

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await createUser({
    full_name,
    username,
    email,
    password: hashedPassword
  })

  const token = jwt.sign(
    { user_id: user.id },
    JWT_SECRET,
    { expiresIn: "1d" }
  )

  return {
    token,
    user: {
      user_id: user.id,
      name: user.full_name,
      username: user.username,
      email: user.email
    }
  }
}

export const loginService = async (identifier: string, password: string) => {
  const user = await findUserByEmailOrUsername(identifier)
  if (!user) throw new Error("User tidak ditemukan")

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error("Password salah")

  const token = jwt.sign(
    { user_id: user.id },
    JWT_SECRET,
    { expiresIn: "1d" }
  )

  return {
    token,
    user: {
      user_id: user.id,
      name: user.full_name,
      username: user.username,
      email: user.email
    }
  }
}