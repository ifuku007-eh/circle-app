import prisma from "../../config/prisma"

export const findUserByEmailOrUsername = async (identifier: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier }
      ]
    }
  })
}

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email }
  })
}

export const createUser = async (data: any) => {
  return prisma.user.create({ data })
}