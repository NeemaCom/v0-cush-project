import { Resend } from "resend"
import { getTemplateByName, renderTemplate } from "./email-templates"

// Initialize Resend with API key, with fallback handling
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

// Update the isEmailFunctional check to be more robust
const isEmailFunctional = !!resend && !!resendApiKey && resendApiKey.length > 0

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
      // Return skipped=true for API key errors to indicate this is a configuration issue
      if (error.message?.includes("API key is invalid") || error.message?.includes("unauthorized")) {
        console.warn("Invalid Resend API key detected. Email sending will be skipped.")
        return { success: false, error, skipped: true }
      }
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error sending email:", error)
    // Also check for API key errors in the caught exception
    if (error?.message?.includes("API key is invalid") || error?.message?.includes("unauthorized")) {
      console.warn("Invalid Resend API key detected. Email sending will be skipped.")
      return { success: false, error, skipped: true }
    }
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
      console.warn(`Template '${templateName}' not found, using fallback plain text email`)
      // Send a simple fallback email instead
      const subject = `Update from Cush`
      let plainTextContent = `Hello ${variables.name || "there"},\n\n`

      // Add some basic content based on template name
      switch (templateName) {
        case "welcome":
          plainTextContent += `Thank you for joining Cush. We're excited to help you with your migration and financial needs.\n\n`
          plainTextContent += `You can now access your dashboard to explore our services.\n\n`
          break
        case "applicationUpdate":
          plainTextContent += `We're writing to inform you that your ${variables.applicationType || "application"} status has been updated to: ${variables.status || "updated"}.\n\n`
          if (variables.details) {
            plainTextContent += `${variables.details}\n\n`
          }
          break
        case "documentRequest":
          plainTextContent += `To proceed with your ${variables.applicationType || "application"}, we need additional documents.\n\n`
          if (variables.documents && Array.isArray(variables.documents)) {
            plainTextContent += `Required documents:\n`
            variables.documents.forEach((doc: string) => {
              plainTextContent += `- ${doc}\n`
            })
            plainTextContent += `\n`
          }
          break
        default:
          plainTextContent += `Thank you for using Cush services.\n\n`
      }

      plainTextContent += `Best regards,\nThe Cush Team`

      // Create a simple HTML version
      const html = plainTextContent.replace(/\n/g, "<br>")

      // Send the fallback email
      return sendEmail({ to, subject, html, from })
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
    return { success: false, error, skipped: true }
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
