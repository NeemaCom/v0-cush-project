"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentList } from "@/components/document-list"
import type { Document } from "@/lib/documents"
import { useToast } from "@/hooks/use-toast"

export function DocumentsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  const fetchDocuments = async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      const response = await fetch("/api/documents")
      const data = await response.json()

      if (data.success) {
        setDocuments(data.documents)
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error)
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchDocuments()
    }
  }, [session?.user?.id])

  const handleDocumentUploadSuccess = (documentId: string) => {
    toast({
      title: "Document Uploaded",
      description: "Your document has been uploaded successfully",
    })
    fetchDocuments()
  }

  const handleDocumentDelete = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
        toast({
          title: "Document Deleted",
          description: "Your document has been deleted successfully",
        })
      } else {
        throw new Error("Failed to delete document")
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return doc.status === "pending"
    if (activeTab === "approved") return doc.status === "approved"
    if (activeTab === "rejected") return doc.status === "rejected"
    return true
  })

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Documents</h1>
        <p className="text-gray-500">Upload and manage your documents</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>Upload supporting documents for your applications</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUpload onSuccess={handleDocumentUploadSuccess} />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
              <CardDescription>View and manage your uploaded documents</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab}>
                  {loading ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <DocumentList documents={filteredDocuments} onDelete={handleDocumentDelete} />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
