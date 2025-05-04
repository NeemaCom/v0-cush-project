import { type NextRequest, NextResponse } from "next/server"
import { renderTemplate } from "@/lib/email-templates"
import { EmailTemplateSchema } from "@/lib/db/schema"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Preview a template with variables
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { template, variables } = body

    // Validate template data
    const validationResult = EmailTemplateSchema.safeParse(template)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    // Render the template
    const html = renderTemplate(validationResult.data, variables || {})

    // Render the subject
    let subject = template.subject
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        if (typeof value === "string" || typeof value === "number") {
          const regex = new RegExp(`{{${key}}}`, "g")
          subject = subject.replace(regex, String(value))
        }
      }
    }

    return NextResponse.json({ html, subject })
  } catch (error) {
    console.error("Error previewing email template:", error)
    return NextResponse.json({ error: "Failed to preview template" }, { status: 500 })
  }
}
