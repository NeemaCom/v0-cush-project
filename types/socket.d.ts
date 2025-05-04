import type { Server as NetServer } from "http"
import type { NextApiResponse } from "next"
import type { Socket as NetSocket } from "net"
import type { Server as SocketIOServer } from "socket.io"

export type NextApiResponseServerIO = NextApiResponse & {
  socket: NetSocket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

// For client-side socket.io types
export interface ServerToClientEvents {
  notification: (notification: any) => void
  "document-status-update": (document: any) => void
  "application-status-update": (application: any) => void
}

export interface ClientToServerEvents {
  "join-room": (userId: string) => void
}
