import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { TemplateEditor } from "@/components/email-editor/template-editor"
import { getTemplateByName } from "@/lib/email-templates"

export const metadata: Metadata = {
  title: "Edit Email Template - Cush Admin",
  description: "Edit an existing email template for Cush platform",
}

export default async function EditTemplatePage({ params }: { params: { id: string } }) {
  const template = await getTemplateByName(params.id)

  if (!template) {
    notFound()
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Email Template</h1>
          <p className="text-muted-foreground">Modify an existing email template for the Cush platform.</p>
        </div>

        <TemplateEditor template={template} isNew={false} />
      </div>
    </div>
  )
}
