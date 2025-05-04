import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to send a test email",
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to } = body

    if (!to) {
      return NextResponse.json({ success: false, error: "Email address is required" }, { status: 400 })
    }

    const result = await sendEmail({
      to,
      subject: "Test Email from Cush",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3366FF;">Test Email</h1>
          <p>Hello,</p>
          <p>This is a test email from the Cush platform. If you're receiving this, it means your email configuration is working correctly.</p>
          <p>Best regards,<br>The Cush Team</p>
        </div>
      `,
    })

    if (result.success) {
      if (result.skipped) {
        return NextResponse.json({
          success: true,
          skipped: true,
          message: "Email sending was skipped because the Resend API key is not configured.",
        })
      }
      return NextResponse.json({
        success: true,
        message: `Test email sent to ${to}`,
      })
    } else {
      return NextResponse.json({ success: false, error: result.error || "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json(
      { success: false, error: "An error occurred while sending the test email" },
      { status: 500 },
    )
  }
}
