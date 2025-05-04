"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, FileText, Check, AlertCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface DocumentUploadProps {
  applicationId?: string
  applicationType?: string
  onSuccess?: (documentId: string) => void
  allowedTypes?: string[]
  maxSize?: number // in MB
  label?: string
  description?: string
}

export function DocumentUpload({
  applicationId,
  applicationType,
  onSuccess,
  allowedTypes = ["application/pdf", "image/jpeg", "image/png"],
  maxSize = 10, // 10MB default
  label = "Upload Document",
  description = "Upload a document in PDF, JPEG, or PNG format (max 10MB)",
}: DocumentUploadProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [documentName, setDocumentName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check file type
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(`Invalid file type. Please upload ${allowedTypes.join(", ")}`)
      return
    }

    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSize}MB`)
      return
    }

    setFile(selectedFile)
    setDocumentName(selectedFile.name)
    setError(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const droppedFile = e.dataTransfer.files?.[0]
    if (!droppedFile) return

    // Check file type
    if (!allowedTypes.includes(droppedFile.type)) {
      setError(`Invalid file type. Please upload ${allowedTypes.join(", ")}`)
      return
    }

    // Check file size
    if (droppedFile.size > maxSize * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSize}MB`)
      return
    }

    setFile(droppedFile)
    setDocumentName(droppedFile.name)
    setError(null)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (!file || !session?.user?.id) return

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", file)
      formData.append("name", documentName || file.name)

      if (applicationId) {
        formData.append("applicationId", applicationId)
      }

      if (applicationType) {
        formData.append("applicationType", applicationType)
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 100)

      // Upload document
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to upload document")
      }

      const data = await response.json()

      setProgress(100)
      setSuccess(true)

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(data.document.id)
      }

      // Reset form after a delay
      setTimeout(() => {
        setFile(null)
        setDocumentName("")
        setProgress(0)
        setSuccess(false)
        router.refresh()
      }, 2000)
    } catch (error) {
      console.error("Error uploading document:", error)
      setError(error instanceof Error ? error.message : "Failed to upload document")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setDocumentName("")
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!file ? (
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-10 w-10 text-gray-400" />
            <h3 className="text-lg font-medium">{label}</h3>
            <p className="text-sm text-gray-500">{description}</p>
            <Button
              variant="outline"
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              Select File
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={allowedTypes.join(",")}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="documentName">Document Name</Label>
                    {success && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                  <Input
                    id="documentName"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    className="mt-1"
                    disabled={uploading || success}
                  />
                </div>
              </div>
              {!success && (
                <Button variant="ghost" size="sm" onClick={handleRemoveFile} disabled={uploading}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {(uploading || success) && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{success ? "Upload complete" : "Uploading..."}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {!success && !uploading && (
              <div className="mt-4 flex justify-end">
                <Button onClick={handleUpload}>Upload Document</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
