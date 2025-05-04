import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"

export const metadata: Metadata = {
  title: "Email Settings - Cush Admin",
  description: "Configure email settings for Cush platform",
}

export default function EmailSettingsPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Email Settings</h1>
          <p className="text-muted-foreground">Configure and test email functionality for the Cush platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Manage your email provider settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Cush uses Resend for sending transactional emails. Make sure your API key is properly configured in the
                environment variables.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Provider</span>
                  <span>Resend</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">API Key Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Configured
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Default From Address</span>
                  <span>noreply@cushfinance.com</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/docs/email-setup.md" target="_blank">
                <Button variant="outline">View Documentation</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Manage and customize email templates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Customize the email templates used for various communications with users. You can edit the content,
                styling, and variables used in each template.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Available Templates</span>
                  <span>3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Custom Templates</span>
                  <span>0</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/admin/email-templates">
                <Button>Manage Templates</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Email Delivery</CardTitle>
              <CardDescription>Send a test email to verify your configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Send a test email to verify that your email configuration is working correctly. This will help ensure
                that users receive important notifications from Cush.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/api/test-email">
                <Button variant="outline">Send Test Email</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Analytics</CardTitle>
              <CardDescription>View email delivery statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Track email delivery rates, open rates, and other metrics to ensure effective communication with your
                users.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
