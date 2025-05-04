"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth({ required = true } = {}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isLoading = status === "loading"
  const isAuthenticated = !!session?.user

  useEffect(() => {
    // If authentication is required and the user is not authenticated
    if (required && !isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [required, isLoading, isAuthenticated, router])

  return {
    session,
    status,
    isLoading,
    isAuthenticated,
    user: session?.user,
  }
}
