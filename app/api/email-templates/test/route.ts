import { type NextRequest, NextResponse } from "next/server"
import { renderTemplate } from "@/lib/email-templates"
import { EmailTemplateSchema } from "@/lib/db/schema"
import { sendEmail } from "@/lib/email"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Send a test email
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { template, variables, to } = body

    if (!to) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 })
    }

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

    // Send the email
    const result = await sendEmail({
      to,
      subject,
      html,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json({ success: false, error: "Failed to send test email" }, { status: 500 })
  }
}
