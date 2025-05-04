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
            return null
          }

          const user = await redis.get(`user:${userId}`)

          if (!user) {
            return null
          }

          const parsedUser = JSON.parse(user as string)

          // Check if password matches
          const passwordMatch = await compare(credentials.password, parsedUser.password)

          if (!passwordMatch) {
            return null
          }

          return {
            id: parsedUser.id,
            name: `${parsedUser.firstName} ${parsedUser.lastName}`,
            email: parsedUser.email,
            role: parsedUser.role || "user",
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
    error: "/login", // Redirect to login page with error
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }
