import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { redis } from "@/lib/redis"

/**
 * NextAuth configuration options
 * @type {import('next-auth').AuthOptions}
 */
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Get user from Redis
          const userKey = `user:email:${credentials.email.toLowerCase()}`
          const userId = await redis.get(userKey)

          if (!userId) {
            console.log("User not found:", credentials.email)
            return null
          }

          const user = await redis.get(`user:${userId}`)

          if (!user) {
            console.log("User data not found for ID:", userId)
            return null
          }

          const userData = JSON.parse(user)

          // Check if password matches
          const passwordMatch = await compare(credentials.password, userData.password)

          if (!passwordMatch) {
            console.log("Password does not match for user:", credentials.email)
            return null
          }

          // Check if email is verified (if verification is required)
          if (userData.emailVerificationRequired && !userData.emailVerified) {
            console.log("Email not verified for user:", credentials.email)
            throw new Error("Verification")
          }

          return {
            id: userId,
            email: userData.email,
            name: `${userData.firstName} ${userData.lastName}`,
            role: userData.role || "user",
            emailVerified: userData.emailVerified,
          }
        } catch (error) {
          console.error("Authorization error:", error)
          throw error
        }
      },
    }),
  ],
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
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.emailVerified = token.emailVerified
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
