import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Server } from "socket.io"

// This is necessary for Socket.IO server
export const dynamic = "force-dynamic"

// Initialize Socket.IO server
const initSocketIO = async (res: Response) => {
  // This only works with the Edge runtime
  if (!(res as any).socket?.server?.io) {
    const io = new Server((res as any).socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    })
    ;(res as any).socket.server.io = io
  }
}

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    await initSocketIO(res)
    return new Response("Socket.IO server initialized")
  } catch (error) {
    console.error("Socket initialization error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
