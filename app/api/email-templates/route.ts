import { type NextRequest, NextResponse } from "next/server"
import { getAllTemplates, saveTemplate } from "@/lib/email-templates"
import { EmailTemplateSchema } from "@/lib/db/schema"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Get all templates
export async function GET() {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const templates = await getAllTemplates()
    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Error fetching email templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

// Create or update a template
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate template data
    const validationResult = EmailTemplateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    // Save the template
    const savedTemplate = await saveTemplate(validationResult.data)

    if (!savedTemplate) {
      return NextResponse.json({ error: "Failed to save template" }, { status: 500 })
    }

    return NextResponse.json({ template: savedTemplate })
  } catch (error) {
    console.error("Error saving email template:", error)
    return NextResponse.json({ error: "Failed to save template" }, { status: 500 })
  }
}
