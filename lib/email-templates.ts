import type { EmailTemplate } from "./db/schema"
import { createClient } from "@/lib/supabase/server"

// Default templates
const defaultTemplates: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "welcome",
    subject: "Welcome to Cush",
    description: "Sent to new users upon registration",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0ea5e9;">Welcome to Cush!</h1>
      <p>Hello {{name}},</p>
      <p>Thank you for joining Cush. We're excited to help you with your migration and financial needs.</p>
      <p>You can now access your dashboard to explore our services:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{dashboardUrl}}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Go to Dashboard
        </a>
      </div>
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The Cush Team</p>
    </div>
  `,
    variables: ["name", "dashboardUrl"],
    isDefault: true,
  },
  {
    name: "applicationUpdate",
    subject: "{{applicationType}} Application Update",
    description: "Notifies users of application status changes",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0ea5e9;">{{applicationType}} Application Update</h1>
      <p>Hello {{name}},</p>
      <p>We're writing to inform you that your {{applicationType}} application status has been updated to: <strong>{{status}}</strong></p>
      {{#if details}}
      <p>{{details}}</p>
      {{/if}}
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{dashboardUrl}}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          View Application
        </a>
      </div>
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The Cush Team</p>
    </div>
  `,
    variables: ["name", "applicationType", "status", "details", "dashboardUrl"],
    isDefault: true,
  },
  {
    name: "documentRequest",
    subject: "Documents Required for Your {{applicationType}} Application",
    description: "Requests additional documents from users",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0ea5e9;">Documents Required</h1>
      <p>Hello {{name}},</p>
      <p>To proceed with your {{applicationType}} application, we need the following documents:</p>
      <ul>
        {{#each documents}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{uploadUrl}}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Upload Documents
        </a>
      </div>
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The Cush Team</p>
    </div>
  `,
    variables: ["name", "applicationType", "documents", "uploadUrl"],
    isDefault: true,
  },
]

// Get template by name with fallback to in-memory templates
export async function getTemplateByName(name: string): Promise<EmailTemplate | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .eq("name", name)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.warn(`Error fetching email template '${name}' from database:`, error)
      // If there's a database error, fall back to in-memory templates
      return getInMemoryTemplate(name)
    }

    if (!data) {
      console.warn(`Email template '${name}' not found in database, using fallback`)
      return getInMemoryTemplate(name)
    }

    return mapDatabaseTemplateToSchema(data)
  } catch (error) {
    console.warn(`Exception fetching email template '${name}':`, error)
    // If there's any other error, fall back to in-memory templates
    return getInMemoryTemplate(name)
  }
}

// Get template from in-memory defaults
function getInMemoryTemplate(name: string): EmailTemplate | null {
  const template = defaultTemplates.find((t) => t.name === name)

  if (!template) {
    console.warn(`No fallback template found for '${name}'`)
    return null
  }

  return {
    ...template,
    id: `fallback-${name}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// Initialize templates in the database
export async function initializeEmailTemplates() {
  try {
    const supabase = createClient()

    // First check if the table exists by trying to query it
    const { error: tableCheckError } = await supabase.from("email_templates").select("id").limit(1)

    // If we get a specific error about relation not existing, the table doesn't exist
    if (
      tableCheckError &&
      tableCheckError.message.includes("relation") &&
      tableCheckError.message.includes("does not exist")
    ) {
      console.warn("email_templates table does not exist. Templates will use in-memory fallbacks.")
      return
    }

    for (const template of defaultTemplates) {
      // Check if template exists
      const { data: existingTemplate, error: checkError } = await supabase
        .from("email_templates")
        .select("id")
        .eq("name", template.name)
        .eq("isDefault", true)
        .single()

      if (checkError && !checkError.message.includes("No rows found")) {
        console.error(`Error checking for template '${template.name}':`, checkError)
        continue
      }

      if (!existingTemplate) {
        // Insert template if it doesn't exist
        const { error: insertError } = await supabase.from("email_templates").insert({
          ...template,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (insertError) {
          console.error(`Error inserting template '${template.name}':`, insertError)
        }
      }
    }
  } catch (error) {
    console.error("Error initializing email templates:", error)
  }
}

// Get all templates
export async function getAllTemplates(): Promise<EmailTemplate[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("email_templates").select("*").order("name")

    if (error) {
      console.warn("Error fetching email templates from database:", error)
      // If there's a database error, fall back to in-memory templates
      return defaultTemplates.map((template) => ({
        ...template,
        id: `fallback-${template.name}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    }

    return data.map(mapDatabaseTemplateToSchema)
  } catch (error) {
    console.warn("Exception fetching email templates:", error)
    // If there's any other error, fall back to in-memory templates
    return defaultTemplates.map((template) => ({
      ...template,
      id: `fallback-${template.name}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  }
}

// Create or update template
export async function saveTemplate(template: EmailTemplate): Promise<EmailTemplate | null> {
  try {
    const supabase = createClient()

    // If template has an ID, update it
    if (template.id && !template.id.startsWith("fallback-")) {
      const { data, error } = await supabase
        .from("email_templates")
        .update({
          name: template.name,
          subject: template.subject,
          description: template.description,
          html: template.html,
          variables: template.variables,
          updated_at: new Date().toISOString(),
        })
        .eq("id", template.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating email template:", error)
        return null
      }

      return mapDatabaseTemplateToSchema(data)
    }
    // Otherwise create a new one
    else {
      const { data, error } = await supabase
        .from("email_templates")
        .insert({
          name: template.name,
          subject: template.subject,
          description: template.description,
          html: template.html,
          variables: template.variables,
          isDefault: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating email template:", error)
        return null
      }

      return mapDatabaseTemplateToSchema(data)
    }
  } catch (error) {
    console.error("Exception saving email template:", error)
    return null
  }
}

// Delete template
export async function deleteTemplate(id: string): Promise<boolean> {
  try {
    // Don't attempt to delete fallback templates
    if (id.startsWith("fallback-")) {
      return false
    }

    const supabase = createClient()
    const { error } = await supabase.from("email_templates").delete().eq("id", id).eq("isDefault", false) // Only allow deletion of non-default templates

    if (error) {
      console.error("Error deleting email template:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Exception deleting email template:", error)
    return false
  }
}

// Helper function to map database fields to schema
function mapDatabaseTemplateToSchema(dbTemplate: any): EmailTemplate {
  return {
    id: dbTemplate.id,
    name: dbTemplate.name,
    subject: dbTemplate.subject,
    description: dbTemplate.description || "",
    html: dbTemplate.html,
    variables: dbTemplate.variables || [],
    isDefault: dbTemplate.isDefault || false,
    createdAt: new Date(dbTemplate.created_at),
    updatedAt: new Date(dbTemplate.updated_at),
  }
}

// Render template with variables
export function renderTemplate(template: EmailTemplate, variables: Record<string, any>): string {
  let html = template.html

  // Replace simple variables
  for (const [key, value] of Object.entries(variables)) {
    if (typeof value === "string" || typeof value === "number") {
      const regex = new RegExp(`{{${key}}}`, "g")
      html = html.replace(regex, String(value))
    }
  }

  // Handle conditional blocks
  html = html.replace(/{{#if ([^}]+)}}([\s\S]*?){{\/if}}/g, (match, condition, content) => {
    const value = variables[condition]
    return value ? content : ""
  })

  // Handle each loops
  html = html.replace(/{{#each ([^}]+)}}([\s\S]*?){{\/each}}/g, (match, arrayName, content) => {
    const array = variables[arrayName]
    if (!Array.isArray(array)) return ""

    return array
      .map((item) => {
        let itemContent = content
        if (typeof item === "string" || typeof item === "number") {
          return itemContent.replace(/{{this}}/g, String(item))
        } else if (typeof item === "object") {
          for (const [key, value] of Object.entries(item)) {
            const regex = new RegExp(`{{this.${key}}}`, "g")
            itemContent = itemContent.replace(regex, String(value))
          }
          return itemContent
        }
        return ""
      })
      .join("")
  })

  return html
}
