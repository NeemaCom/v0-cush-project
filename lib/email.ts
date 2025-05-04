import { Resend } from "resend"
import { getTemplateByName, renderTemplate } from "./email-templates"

// Initialize Resend with API key, with fallback handling
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

// Check if email functionality is available
const isEmailFunctional = !!resend && !!resendApiKey

// Send email function
export async function sendEmail({
  to,
  subject,
  html,
  from = "Cush <noreply@cushfinance.com>",
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  // If email functionality is not available, log and return gracefully
  if (!isEmailFunctional) {
    console.log("Email sending skipped: Resend API key not configured")
    return { success: true, skipped: true }
  }

  try {
    const { data, error } = await resend!.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

// Send email using a template
export async function sendTemplateEmail({
  to,
  templateName,
  variables,
  from = "Cush <noreply@cushfinance.com>",
}: {
  to: string
  templateName: string
  variables: Record<string, any>
  from?: string
}) {
  try {
    // Get the template
    const template = await getTemplateByName(templateName)

    if (!template) {
      console.error(`Template '${templateName}' not found`)
      return { success: false, error: `Template '${templateName}' not found` }
    }

    // Render the template with variables
    const html = renderTemplate(template, variables)

    // Render the subject with variables
    let subject = template.subject
    for (const [key, value] of Object.entries(variables)) {
      if (typeof value === "string" || typeof value === "number") {
        const regex = new RegExp(`{{${key}}}`, "g")
        subject = subject.replace(regex, String(value))
      }
    }

    // Send the email
    return sendEmail({ to, subject, html, from })
  } catch (error) {
    console.error("Error sending template email:", error)
    return { success: false, error }
  }
}

// Helper functions for common emails
export async function sendWelcomeEmail(to: string, name: string) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`

  return sendTemplateEmail({
    to,
    templateName: "welcome",
    variables: { name, dashboardUrl },
  })
}

export async function sendApplicationUpdateEmail(
  to: string,
  name: string,
  applicationType: string,
  status: string,
  details?: string,
) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`

  return sendTemplateEmail({
    to,
    templateName: "applicationUpdate",
    variables: { name, applicationType, status, details, dashboardUrl },
  })
}

export async function sendDocumentRequestEmail(to: string, name: string, applicationType: string, documents: string[]) {
  const uploadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/documents/upload`

  return sendTemplateEmail({
    to,
    templateName: "documentRequest",
    variables: { name, applicationType, documents, uploadUrl },
  })
}
