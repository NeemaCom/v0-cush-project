import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { uploadDocument } from "@/lib/documents"
import { createNotification } from "@/lib/notifications"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 })
    }

    const name = formData.get("name") as string
    const applicationId = formData.get("applicationId") as string
    const applicationType = formData.get("applicationType") as string

    const document = await uploadDocument({
      file,
      userId: session.user.id,
      applicationId: applicationId || undefined,
      applicationType: applicationType || undefined,
      name: name || undefined,
    })

    // Create notification for document upload
    await createNotification({
      userId: session.user.id,
      title: "Document Uploaded",
      message: `Your document "${document.name}" has been uploaded and is pending review.`,
      type: "info",
      link: "/dashboard/documents",
    })

    return NextResponse.json({
      success: true,
      document,
    })
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json({ success: false, message: "Failed to upload document" }, { status: 500 })
  }
}
