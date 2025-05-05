"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TestDocumentUpload } from "@/utils/test-document-upload"

export default function DocumentTestPageClient() {
  const { user, isLoading } = useAuth({ required: true })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Document Upload Testing</h1>
        <p className="text-gray-500">Test and verify the document upload functionality</p>
      </header>

      <div className="mb-6 flex justify-between items-center">
        <Button asChild variant="outline">
          <Link href="/dashboard/documents">← Back to Documents</Link>
        </Button>
      </div>

      <TestDocumentUpload />
    </div>
  )
}
