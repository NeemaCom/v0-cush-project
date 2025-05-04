"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save } from "lucide-react"
import { type EmailTemplate, EmailTemplateSchema } from "@/lib/db/schema"
import { RichTextEditor } from "./rich-text-editor"
import { VariableSelector } from "./variable-selector"
import { VariableManager } from "./variable-manager"
import { TemplatePreview } from "./template-preview"
import { PreviewVariables } from "./preview-variables"
import { TemplateTester } from "./template-tester"

interface TemplateEditorProps {
  template?: EmailTemplate
  isNew?: boolean
}

const defaultTemplate: EmailTemplate = {
  name: "",
  subject: "",
  description: "",
  html: "",
  variables: [],
  isDefault: false,
}

export function TemplateEditor({ template = defaultTemplate, isNew = true }: TemplateEditorProps) {
  const [editedTemplate, setEditedTemplate] = useState<EmailTemplate>(template)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const [previewVariables, setPreviewVariables] = useState<Record<string, any>>({})
  const { toast } = useToast()
  const router = useRouter()

  // Initialize preview variables based on template variables
  useEffect(() => {
    const initialPreviewData: Record<string, any> = {}

    template.variables.forEach((variable) => {
      if (variable === "name") {
        initialPreviewData[variable] = "John Doe"
      } else if (variable === "email") {
        initialPreviewData[variable] = "john.doe@example.com"
      } else if (variable === "applicationType") {
        initialPreviewData[variable] = "Migration"
      } else if (variable === "status") {
        initialPreviewData[variable] = "Approved"
      } else if (variable === "details") {
        initialPreviewData[variable] = "Your application has been approved. Please proceed to the next step."
      } else if (variable === "documents") {
        initialPreviewData[variable] = ["Passport", "Birth Certificate", "Proof of Address"]
      } else if (variable === "dashboardUrl") {
        initialPreviewData[variable] = "https://example.com/dashboard"
      } else if (variable === "uploadUrl") {
        initialPreviewData[variable] = "https://example.com/upload"
      } else {
        initialPreviewData[variable] = `Sample ${variable} value`
      }
    })

    setPreviewVariables(initialPreviewData)
  }, [template.variables])

  const handleEditorChange = (html: string) => {
    setEditedTemplate((prev) => ({ ...prev, html }))
  }

  const handleVariableSelect = (variable: string) => {
    // Insert the variable at the cursor position in the editor
    // This is a simplified approach - in a real implementation, you would need to
    // integrate with the editor's API to insert at the cursor position
    setEditedTemplate((prev) => ({
      ...prev,
      html: prev.html + " " + variable,
    }))
  }

  const handleVariablesChange = (variables: string[]) => {
    setEditedTemplate((prev) => ({ ...prev, variables }))
  }

  const saveTemplate = async () => {
    // Validate the template
    const validationResult = EmailTemplateSchema.safeParse(editedTemplate)
    if (!validationResult.success) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/email-templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedTemplate),
      })

      if (!response.ok) {
        throw new Error("Failed to save template")
      }

      const data = await response.json()

      toast({
        title: "Template Saved",
        description: `The template "${editedTemplate.name}" has been saved successfully.`,
      })

      if (isNew) {
        router.push(`/admin/email-templates/${data.template.id}`)
      } else {
        setEditedTemplate(data.template)
      }
    } catch (error) {
      console.error("Error saving template:", error)
      toast({
        title: "Error",
        description: "Failed to save the template. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{isNew ? "Create New Template" : `Edit Template: ${template.name}`}</h2>
        <Button onClick={saveTemplate} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Template
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "edit" | "preview")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit Template</TabsTrigger>
          <TabsTrigger value="preview">Preview & Test</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={editedTemplate.name}
                  onChange={(e) => setEditedTemplate((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., welcome, password-reset"
                  disabled={template.isDefault}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={editedTemplate.subject}
                  onChange={(e) => setEditedTemplate((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g., Welcome to FinMigrate"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedTemplate.description}
                  onChange={(e) => setEditedTemplate((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of when this template is used"
                  rows={3}
                />
              </div>

              <Card>
                <CardContent className="p-4">
                  <VariableManager variables={editedTemplate.variables} onChange={handleVariablesChange} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="html-content">Email Content</Label>
                <VariableSelector
                  variables={editedTemplate.variables}
                  onSelectVariable={handleVariableSelect}
                  className="h-8 text-xs"
                />
              </div>

              <RichTextEditor
                content={editedTemplate.html}
                onChange={handleEditorChange}
                placeholder="Write your email content here..."
              />

              <p className="text-sm text-muted-foreground">
                Use the variable selector above to insert dynamic content. Variables will be replaced with actual values
                when the email is sent.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <PreviewVariables
                variables={editedTemplate.variables}
                previewData={previewVariables}
                onChange={setPreviewVariables}
              />

              <TemplateTester template={editedTemplate} previewVariables={previewVariables} />
            </div>

            <div>
              <TemplatePreview template={editedTemplate} previewVariables={previewVariables} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
