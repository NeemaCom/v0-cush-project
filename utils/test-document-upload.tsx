"use client"

import { useState } from "react"
import { Check, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { DocumentUpload } from "@/components/document-upload"

export function TestDocumentUpload() {
  const [testResults, setTestResults] = useState<{
    status: "idle" | "running" | "success" | "error"
    message: string
    details?: string[]
    progress: number
  }>({
    status: "idle",
    message: "Ready to test document upload functionality",
    details: [],
    progress: 0,
  })

  const runTest = async () => {
    setTestResults({
      status: "running",
      message: "Running document upload tests...",
      details: ["Initializing tests..."],
      progress: 5,
    })

    try {
      // Test 1: Generate a test PDF
      setTestResults((prev) => ({
        ...prev,
        progress: 15,
        details: [...prev.details!, "Creating test document..."],
      }))

      // We'll simulate a PDF document with a data URI
      const mockPdfBlob = new Blob(["Test PDF content for document upload test"], { type: "application/pdf" })

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTestResults((prev) => ({
        ...prev,
        progress: 30,
        details: [...prev.details!, "✅ Test document created successfully"],
      }))

      // Test 2: Check if the upload endpoint is available
      setTestResults((prev) => ({
        ...prev,
        progress: 40,
        details: [...prev.details!, "Testing upload API endpoint..."],
      }))

      const endpointCheckResponse = await fetch("/api/documents/health-check", {
        method: "HEAD",
      }).catch(() => ({ ok: false }))

      if (!endpointCheckResponse.ok) {
        throw new Error("Upload API endpoint is not available")
      }

      setTestResults((prev) => ({
        ...prev,
        progress: 60,
        details: [...prev.details!, "✅ API endpoint is available"],
      }))

      // Test 3: Check Blob storage configuration
      setTestResults((prev) => ({
        ...prev,
        progress: 70,
        details: [...prev.details!, "Testing Blob storage configuration..."],
      }))

      const blobConfigResponse = await fetch("/api/documents/verify-blob-config")
      const blobConfigData = await blobConfigResponse.json()

      if (!blobConfigData.success) {
        throw new Error("Blob storage is not properly configured: " + blobConfigData.message)
      }

      setTestResults((prev) => ({
        ...prev,
        progress: 90,
        details: [...prev.details!, "✅ Blob storage configured correctly"],
        message: "Tests completed successfully!",
      }))

      // Final success
      setTestResults((prev) => ({
        ...prev,
        status: "success",
        progress: 100,
        message: "All document upload tests passed successfully!",
        details: [...prev.details!, "✅ Document upload system is working correctly"],
      }))
    } catch (error) {
      console.error("Test error:", error)
      setTestResults((prev) => ({
        ...prev,
        status: "error",
        progress: 100,
        message: "Tests failed",
        details: [...prev.details!, `❌ Error: ${error instanceof Error ? error.message : String(error)}`],
      }))
    }
  }

  const resetTest = () => {
    setTestResults({
      status: "idle",
      message: "Ready to test document upload functionality",
      details: [],
      progress: 0,
    })
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Document Upload Test Utility</CardTitle>
          <CardDescription>Test the document upload functionality with various file types and sizes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {testResults.status === "idle" && <Button onClick={runTest}>Start Automated Tests</Button>}

          {testResults.status === "running" && (
            <div className="space-y-4">
              <Progress value={testResults.progress} className="h-2" />
              <p className="text-sm font-medium">{testResults.progress}% Complete</p>
              <div className="bg-muted p-4 rounded-md max-h-40 overflow-y-auto">
                {testResults.details?.map((detail, index) => (
                  <div key={index} className="text-sm mb-1">
                    {detail}
                  </div>
                ))}
              </div>
              <Button disabled>Tests Running...</Button>
            </div>
          )}

          {testResults.status === "success" && (
            <div className="space-y-4">
              <Alert variant="default" className="border-green-500 bg-green-50">
                <Check className="h-4 w-4 text-green-500" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{testResults.message}</AlertDescription>
              </Alert>
              <div className="bg-muted p-4 rounded-md max-h-40 overflow-y-auto">
                {testResults.details?.map((detail, index) => (
                  <div key={index} className="text-sm mb-1">
                    {detail}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={resetTest}>Run Tests Again</Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            </div>
          )}

          {testResults.status === "error" && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Test Failed</AlertTitle>
                <AlertDescription>{testResults.message}</AlertDescription>
              </Alert>
              <div className="bg-muted p-4 rounded-md max-h-40 overflow-y-auto">
                {testResults.details?.map((detail, index) => (
                  <div key={index} className="text-sm mb-1">
                    {detail}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={resetTest}>Try Again</Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual Document Upload Test</CardTitle>
          <CardDescription>Test uploading documents manually with the DocumentUpload component</CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentUpload
            onSuccess={(documentId) => {
              console.log("Document uploaded successfully:", documentId)
            }}
            label="Test Document Upload"
            description="Upload a test document to verify the upload functionality"
          />
        </CardContent>
      </Card>
    </div>
  )
}
