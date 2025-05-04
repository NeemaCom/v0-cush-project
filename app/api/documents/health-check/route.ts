import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function HEAD(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return new Response(null, {
      status: 401,
      headers: {
        "X-Status": "unauthorized",
      },
    })
  }

  return new Response(null, {
    status: 200,
    headers: {
      "X-Status": "ok",
    },
  })
}
