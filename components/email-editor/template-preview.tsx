"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, RefreshCw } from "lucide-react"
import type { EmailTemplate } from "@/lib/db/schema"

interface TemplatePreviewProps {
  template: EmailTemplate
  previewVariables: Record<string, any>
}

export function TemplatePreview({ template, previewVariables }: TemplatePreviewProps) {
  const [preview, setPreview] = useState<{ html: string; subject: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"rendered" | "code">("rendered")

  const generatePreview = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/email-templates/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template,
          variables: previewVariables,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate preview")
      }

      const data = await response.json()
      setPreview(data)
    } catch (error) {
      console.error("Error generating preview:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generatePreview()
  }, [template, previewVariables])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Preview</h3>
        <Button variant="outline" size="sm" onClick={generatePreview} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh Preview
        </Button>
      </div>

      {preview && (
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-md">
            <p className="font-medium">Subject: {preview.subject}</p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "rendered" | "code")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rendered">Rendered</TabsTrigger>
              <TabsTrigger value="code">HTML Code</TabsTrigger>
            </TabsList>
            <TabsContent value="rendered" className="mt-2">
              <Card>
                <CardContent className="p-4">
                  <div className="email-preview" dangerouslySetInnerHTML={{ __html: preview.html }} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="code" className="mt-2">
              <Card>
                <CardContent className="p-4">
                  <pre className="text-xs overflow-auto bg-muted p-4 rounded-md max-h-[400px]">{preview.html}</pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {loading && !preview && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  )
}
