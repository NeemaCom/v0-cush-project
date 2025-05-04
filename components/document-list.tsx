"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Download, Trash2, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Document } from "@/lib/documents"

interface DocumentListProps {
  documents: Document[]
  onDelete?: (documentId: string) => void
  isAdmin?: boolean
}

export function DocumentList({ documents, onDelete, isAdmin = false }: DocumentListProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)

  if (!documents.length) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No documents</h3>
        <p className="text-sm text-gray-500">Upload documents to get started</p>
      </div>
    )
  }

  const handleDeleteClick = (documentId: string) => {
    setDocumentToDelete(documentId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!documentToDelete || !onDelete) return

    onDelete(documentToDelete)
    setDeleteDialogOpen(false)
    setDocumentToDelete(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  return (
    <>
      <div className="space-y-4">
        {documents.map((document) => (
          <Card key={document.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{document.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{(document.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(document.status)}

                  <Button variant="ghost" size="icon" asChild>
                    <a href={document.url} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>

                  <Button variant="ghost" size="icon" asChild>
                    <a href={document.url} download={document.name}>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>

                  {(session?.user?.id === document.userId || isAdmin) && onDelete && (
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(document.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>

              {document.notes && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <p className="font-medium">Notes:</p>
                  <p>{document.notes}</p>
                </div>
              )}

              {isAdmin && document.status === "pending" && (
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                    onClick={() => router.push(`/admin/documents/${document.id}/review?action=reject`)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => router.push(`/admin/documents/${document.id}/review?action=approve`)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
