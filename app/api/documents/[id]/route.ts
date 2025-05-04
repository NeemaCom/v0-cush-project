import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getDocument, deleteDocument, updateDocumentStatus } from "@/lib/documents"
import { createNotification } from "@/lib/notifications"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const documentId = params.id

  try {
    const document = await getDocument(documentId)

    if (!document) {
      return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 })
    }

    // Check if user has access to this document
    if (document.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      document,
    })
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch document" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const documentId = params.id

  try {
    const document = await getDocument(documentId)

    if (!document) {
      return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 })
    }

    // Check if user has access to delete this document
    if (document.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 })
    }

    const deleted = await deleteDocument(documentId, session.user.id)

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Failed to delete document" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ success: false, message: "Failed to delete document" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  // Only admins can update document status
  if (session.user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 })
  }

  const documentId = params.id

  try {
    const body = await request.json()
    const { status, notes } = body

    if (!status) {
      return NextResponse.json({ success: false, message: "Status is required" }, { status: 400 })
    }

    const document = await getDocument(documentId)

    if (!document) {
      return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 })
    }

    const updatedDocument = await updateDocumentStatus({
      documentId,
      status,
      notes,
      reviewedBy: session.user.id,
    })

    if (!updatedDocument) {
      return NextResponse.json({ success: false, message: "Failed to update document status" }, { status: 500 })
    }

    // Create notification for document status update
    await createNotification({
      userId: document.userId,
      title: "Document Status Updated",
      message: `Your document "${document.name}" has been ${status}.`,
      type: status === "approved" ? "success" : status === "rejected" ? "error" : "info",
      link: "/dashboard/documents",
    })

    return NextResponse.json({
      success: true,
      document: updatedDocument,
    })
  } catch (error) {
    console.error("Error updating document status:", error)
    return NextResponse.json({ success: false, message: "Failed to update document status" }, { status: 500 })
  }
}
