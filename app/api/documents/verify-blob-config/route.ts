import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    )
  }

  // Check if the BLOB_READ_WRITE_TOKEN environment variable is set
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        success: false,
        message: "Blob storage is not configured. BLOB_READ_WRITE_TOKEN is missing.",
      },
      { status: 500 },
    )
  }

  return NextResponse.json({
    success: true,
    message: "Blob storage is properly configured",
  })
}
