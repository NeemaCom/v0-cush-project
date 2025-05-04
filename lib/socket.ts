import type { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import type { NextApiRequest } from "next"
import type { NextApiResponse } from "next"
import { redis } from "./redis"

export type SocketServer = SocketIOServer

export const initSocketServer = (req: NextApiRequest, res: NextApiResponse) => {
  if (!(res.socket as any).server.io) {
    const httpServer: NetServer = (res.socket as any).server
    const io = new SocketIOServer(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
    })

    io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`)

      socket.on("join", (userId: string) => {
        socket.join(`user:${userId}`)
        console.log(`User ${userId} joined their room`)
      })

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`)
      })
    })
    ;(res.socket as any).server.io = io
  }

  return (res.socket as any).server.io
}

export const emitToUser = async (userId: string, event: string, data: any) => {
  // Store the event in Redis for users who are not currently connected
  await redis.lpush(`user:${userId}:events`, JSON.stringify({ event, data, timestamp: Date.now() }))

  // If we're in a server context where the socket server is available, emit directly
  if (global.io) {
    global.io.to(`user:${userId}`).emit(event, data)
  }
}

export const getUserPendingEvents = async (userId: string) => {
  const events = await redis.lrange(`user:${userId}:events`, 0, -1)
  await redis.del(`user:${userId}:events`)

  return events.map((event) => JSON.parse(event as string))
}
