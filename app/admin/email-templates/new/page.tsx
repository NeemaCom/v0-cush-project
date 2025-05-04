import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin-sidebar"
import { TemplateEditor } from "@/components/email-editor/template-editor"

export const metadata: Metadata = {
  title: "Create Email Template - Cush Admin",
  description: "Create a new email template for Cush platform",
}

export default function NewTemplatePage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Email Template</h1>
          <p className="text-muted-foreground">Design a new email template for the Cush platform.</p>
        </div>

        <TemplateEditor isNew={true} />
      </div>
    </div>
  )
}
