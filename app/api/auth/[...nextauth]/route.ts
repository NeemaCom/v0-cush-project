import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { redis } from "@/lib/redis"

// Create a simpler NextAuth handler
export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Get user from Redis
          const userKey = `user:email:${credentials.email.toLowerCase()}`
          const userId = await redis.get(userKey)

          if (!userId) {
            console.log(`User not found for email: ${credentials.email}`)
            return null
          }

          const user = await redis.get(`user:${userId}`)

          if (!user) {
            console.log(`User data not found for ID: ${userId}`)
            return null
          }

          const parsedUser = JSON.parse(user as string)

          // Check if password matches
          const passwordMatch = await compare(credentials.password, parsedUser.password)

          if (!passwordMatch) {
            console.log(`Password mismatch for user: ${parsedUser.id}`)
            return null
          }

          // Check if email is verified
          if (!parsedUser.emailVerified) {
            // Instead of returning null, we'll return the user with a special flag
            // This allows us to handle unverified users in the callbacks
            return {
              id: parsedUser.id,
              name: `${parsedUser.firstName} ${parsedUser.lastName}`,
              email: parsedUser.email,
              role: parsedUser.role || "user",
              emailVerified: false,
            }
          }

          return {
            id: parsedUser.id,
            name: `${parsedUser.firstName} ${parsedUser.lastName}`,
            email: parsedUser.email,
            role: parsedUser.role || "user",
            emailVerified: true,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error", // Change to a proper error page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.emailVerified = token.emailVerified as boolean
      }
      return session
    },
    async signIn({ user }) {
      // If the user's email is not verified, redirect to a verification page
      if (user && user.emailVerified === false) {
        return `/unverified-email?email=${encodeURIComponent(user.email as string)}`
      }
      return true
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
