import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (_, __, profile, done) => {
      let user = await prisma.user.findUnique({
        where: { email: profile.emails![0].value },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: profile.emails![0].value,
            name: profile.displayName,
            provider: "google",
          },
        })
      }

      done(null, user)
    }
  )
)

export default passport