import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/admin-sidebar"
import { TemplateList } from "@/components/email-editor/template-list"

export const metadata: Metadata = {
  title: "Email Templates - Cush Admin",
  description: "Manage email templates for Cush platform",
}

export default function EmailTemplatesPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Email Templates</h1>
            <p className="text-muted-foreground">Manage and customize email templates for the Cush platform.</p>
          </div>
          <Link href="/admin/email-templates/new">
            <Button>Create New Template</Button>
          </Link>
        </div>

        <TemplateList />
      </div>
    </div>
  )
}
