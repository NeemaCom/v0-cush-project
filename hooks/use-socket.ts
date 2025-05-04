"use client"

import { useEffect, useRef, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { useSession } from "next-auth/react"
import type { ServerToClientEvents, ClientToServerEvents } from "@/types/socket"

export function useSocket() {
  const { data: session } = useSession()
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)

  useEffect(() => {
    // Initialize socket connection
    if (session?.user?.id && !socketRef.current) {
      // Connect to WebSocket server
      socketRef.current = io({
        path: "/api/socket",
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      // Socket event handlers
      socketRef.current.on("connect", () => {
        console.log("Socket connected")
        setIsConnected(true)

        // Join user's room
        socketRef.current?.emit("join-room", session.user.id)
      })

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected")
        setIsConnected(false)
      })

      socketRef.current.on("connect_error", (err) => {
        console.error("Socket connect error:", err)
        setIsConnected(false)
      })
    }

    // Cleanup socket connection when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [session?.user?.id])

  return {
    socket: socketRef.current,
    isConnected,
  }
}
