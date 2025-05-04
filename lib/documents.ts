import { put, del } from "@vercel/blob"
import { redis } from "./redis"
import { v4 as uuidv4 } from "uuid"

export type DocumentStatus = "pending" | "approved" | "rejected"

export interface Document {
  id: string
  userId: string
  applicationId?: string
  applicationType?: string
  name: string
  type: string
  size: number
  url: string
  status: DocumentStatus
  notes?: string
  uploadedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

// Upload a document
export async function uploadDocument({
  file,
  userId,
  applicationId,
  applicationType,
  name,
}: {
  file: File
  userId: string
  applicationId?: string
  applicationType?: string
  name?: string
}): Promise<Document> {
  // Generate a unique filename
  const filename = `${userId}/${uuidv4()}-${file.name}`

  // Upload to Vercel Blob
  const blob = await put(filename, file, {
    access: "private",
  })

  // Create document record
  const document: Document = {
    id: uuidv4(),
    userId,
    applicationId,
    applicationType,
    name: name || file.name,
    type: file.type,
    size: file.size,
    url: blob.url,
    status: "pending",
    uploadedAt: new Date().toISOString(),
  }

  // Save document to Redis
  await redis.set(`document:${document.id}`, JSON.stringify(document))

  // Add to user's document list
  await redis.lpush(`user:${userId}:documents`, document.id)

  // If associated with an application, add to application's document list
  if (applicationId) {
    await redis.lpush(`application:${applicationType}:${applicationId}:documents`, document.id)
  }

  return document
}

// Get document by ID
export async function getDocument(documentId: string): Promise<Document | null> {
  const document = await redis.get(`document:${documentId}`)
  return document ? JSON.parse(document as string) : null
}

// Get user documents
export async function getUserDocuments(userId: string): Promise<Document[]> {
  const documentIds = await redis.lrange(`user:${userId}:documents`, 0, -1)

  if (!documentIds.length) return []

  const documents: Document[] = []

  for (const id of documentIds) {
    const document = await redis.get(`document:${id}`)
    if (document) {
      documents.push(JSON.parse(document as string))
    }
  }

  return documents.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
}

// Get application documents
export async function getApplicationDocuments(applicationType: string, applicationId: string): Promise<Document[]> {
  const documentIds = await redis.lrange(`application:${applicationType}:${applicationId}:documents`, 0, -1)

  if (!documentIds.length) return []

  const documents: Document[] = []

  for (const id of documentIds) {
    const document = await redis.get(`document:${id}`)
    if (document) {
      documents.push(JSON.parse(document as string))
    }
  }

  return documents.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
}

// Update document status
export async function updateDocumentStatus({
  documentId,
  status,
  notes,
  reviewedBy,
}: {
  documentId: string
  status: DocumentStatus
  notes?: string
  reviewedBy?: string
}): Promise<Document | null> {
  const documentKey = `document:${documentId}`
  const document = await redis.get(documentKey)

  if (!document) return null

  const parsedDocument: Document = JSON.parse(document as string)

  // Update document
  const updatedDocument: Document = {
    ...parsedDocument,
    status,
    notes: notes || parsedDocument.notes,
    reviewedAt: new Date().toISOString(),
    reviewedBy,
  }

  // Save updated document
  await redis.set(documentKey, JSON.stringify(updatedDocument))

  return updatedDocument
}

// Delete document
export async function deleteDocument(documentId: string, userId: string): Promise<boolean> {
  const documentKey = `document:${documentId}`
  const document = await redis.get(documentKey)

  if (!document) return false

  const parsedDocument: Document = JSON.parse(document as string)

  // Verify ownership
  if (parsedDocument.userId !== userId) return false

  try {
    // Delete from Vercel Blob
    const urlParts = new URL(parsedDocument.url).pathname.split("/")
    const blobPath = urlParts[urlParts.length - 1]
    await del(blobPath)

    // Delete from Redis
    await redis.del(documentKey)
    await redis.lrem(`user:${userId}:documents`, 0, documentId)

    // If associated with an application, remove from application's document list
    if (parsedDocument.applicationId && parsedDocument.applicationType) {
      await redis.lrem(
        `application:${parsedDocument.applicationType}:${parsedDocument.applicationId}:documents`,
        0,
        documentId,
      )
    }

    return true
  } catch (error) {
    console.error("Error deleting document:", error)
    return false
  }
}
