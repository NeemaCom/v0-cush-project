"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface UseAuthOptions {
  required?: boolean
  redirectTo?: string
  role?: string | string[]
}

export function useAuth(options: UseAuthOptions = {}) {
  const { required = false, redirectTo = "/login", role } = options
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Only run on the client side
    if (typeof window === "undefined") return

    if (status === "loading") {
      setIsLoading(true)
      return
    }

    if (required && !session) {
      router.push(redirectTo)
      return
    }

    if (role && session?.user) {
      const userRole = session.user.role as string
      const requiredRoles = Array.isArray(role) ? role : [role]

      if (!requiredRoles.includes(userRole)) {
        router.push("/dashboard")
        return
      }
    }

    setIsLoading(false)
  }, [session, status, required, redirectTo, role, router])

  return {
    user: session?.user,
    isLoading: status === "loading" || isLoading,
    isAuthenticated: !!session,
  }
}
