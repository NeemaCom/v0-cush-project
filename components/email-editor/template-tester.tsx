"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { EmailTemplate } from "@/lib/db/schema"

interface TemplateTesterProps {
  template: EmailTemplate
  previewVariables: Record<string, any>
}

export function TemplateTester({ template, previewVariables }: TemplateTesterProps) {
  const [testEmail, setTestEmail] = useState("")
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send the test to.",
        variant: "destructive",
      })
      return
    }

    setSending(true)
    try {
      const response = await fetch("/api/email-templates/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template,
          variables: previewVariables,
          to: testEmail,
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.skipped) {
          toast({
            title: "Email Skipped",
            description: "Email sending was skipped because the Resend API key is not configured.",
            variant: "default",
          })
        } else {
          toast({
            title: "Test Email Sent",
            description: `Email successfully sent to ${testEmail}`,
            variant: "default",
          })
        }
      } else {
        toast({
          title: "Failed to Send Email",
          description: data.error || "An error occurred while sending the test email.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending test email:", error)
      toast({
        title: "Failed to Send Email",
        description: "An error occurred while sending the test email.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Send Test Email</h3>
      <div className="space-y-2">
        <Label htmlFor="test-email">Recipient Email</Label>
        <div className="flex gap-2">
          <Input
            id="test-email"
            type="email"
            placeholder="Enter email address"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          <Button onClick={sendTestEmail} disabled={sending}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Send Test
          </Button>
        </div>
      </div>
    </div>
  )
}
