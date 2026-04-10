import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { successResponse, errorResponse } from '../utils/response'

const prisma = new PrismaClient()

const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

// ✅ Register — sekarang juga return token
export const register = async (req: Request, res: Response) => {
  try {
    const { username, name, email, password } = req.body

    // Validasi input
    if (!username || !name || !email || !password) {
      return errorResponse(res, 'Semua field wajib diisi', 400)
    }

    // Cek apakah username atau email sudah ada
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    })
    if (existing) {
      return errorResponse(res, 'Username atau email sudah digunakan', 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        full_name: name,
        email,
        password: hashedPassword,
        created_by: 0 // system
      }
    })

    // Generate token langsung saat register
    const token = generateToken(user.id)

    return successResponse(res, 'Registrasi berhasil. Akun berhasil dibuat.', {
      user_id: String(user.id),
      username: user.username,
      name: user.full_name,
      email: user.email,
      token
    })
  } catch (error) {
    return errorResponse(res, 'Invalid register')
  }
}

// ✅ Login — pakai identifier (bisa email atau username)
export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      return errorResponse(res, 'Identifier dan password wajib diisi', 400)
    }

    // Cari user berdasarkan email ATAU username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ]
      }
    })

    if (!user) {
      return errorResponse(res, 'Invalid Login', 500)
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return errorResponse(res, 'Invalid Login', 500)
    }

    const token = generateToken(user.id)

    return successResponse(res, 'Login successful.', {
      user_id: String(user.id),
      username: user.username,
      name: user.full_name,
      email: user.email,
      avatar: user.photo_profile ?? null,
      token
    })
  } catch (error) {
    return errorResponse(res, 'Invalid Login')
  }
}