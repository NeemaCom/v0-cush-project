import { z } from "zod"

// Email Template Schema
export const EmailTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Template name is required"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  html: z.string().min(1, "HTML content is required"),
  variables: z.array(z.string()).default([]),
  isDefault: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type EmailTemplate = z.infer<typeof EmailTemplateSchema>
