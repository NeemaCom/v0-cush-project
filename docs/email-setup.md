# Setting Up Resend API Key for Email Functionality

This guide will walk you through the process of setting up Resend for email functionality in the Cush platform.

## What is Resend?

[Resend](https://resend.com) is a modern email API for developers that allows you to send transactional emails from your application. Cush uses Resend to send:

- Welcome emails to new users
- Application status updates
- Document request notifications
- Consultation booking confirmations

## Prerequisites

- A Cush account with admin access
- Access to your project's environment variables (either locally or on Vercel)

## Step 1: Create a Resend Account

1. Go to [Resend's website](https://resend.com) and click "Sign Up"
2. Complete the registration process using your work email
3. Verify your email address by clicking the link sent to your inbox

## Step 2: Generate an API Key

1. Log in to your Resend dashboard
2. Navigate to the "API Keys" section in the left sidebar
3. Click "Create API Key"
4. Give your API key a descriptive name (e.g., "Cush Production" or "Cush Development")
5. Select the appropriate permissions (for most cases, "Full Access" is required)
6. Click "Create API Key"
7. **Important**: Copy your API key immediately and store it securely. You won't be able to see it again!

## Step 3: Add the API Key to Your Environment Variables

### For Local Development

1. Open your project's `.env.local` file (create it if it doesn't exist)
2. Add the following line:
   \`\`\`
   RESEND_API_KEY=your_api_key_here
   \`\`\`
3. Save the file
4. Restart your development server

### For Vercel Deployment

1. Log in to your [Vercel dashboard](https://vercel.com)
2. Select your Cush project
3. Go to "Settings" > "Environment Variables"
4. Add a new environment variable:
   - Name: `RESEND_API_KEY`
   - Value: Your Resend API key
   - Environment: Select all environments that need email functionality
5. Click "Save"
6. Redeploy your application for the changes to take effect

## Step 4: Configure a Sending Domain (Optional but Recommended)

For production use, it's recommended to set up a custom sending domain:

1. In your Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Follow the instructions to verify your domain
4. Once verified, update your email configuration in `lib/email.ts` to use your custom domain:
   \`\`\`typescript
   from = "Cush <noreply@yourdomain.com>"
   \`\`\`

## Step 5: Test Email Functionality

1. Navigate to `/api/test-email` in your browser or use the admin dashboard's email testing tool
2. Enter a test email address (preferably your own)
3. Click "Send Test Email"
4. Check your inbox to verify the email was received

## Troubleshooting

### "API key is invalid" Error

If you see this error:
- Verify that you've copied the API key correctly
- Check that the environment variable is properly set
- Ensure you're using the correct API key for your environment

### Emails Not Being Sent

If emails aren't being sent but no error is shown:
- Check your Resend dashboard for any sending limits or restrictions
- Verify that your sending domain is properly configured (if using a custom domain)
- Check the Resend logs for any delivery issues

### Emails Going to Spam

If emails are being marked as spam:
- Complete the domain verification process
- Ensure your email content follows best practices
- Consider implementing SPF, DKIM, and DMARC records for your domain

## Support

If you continue to experience issues with email functionality:
- Check the [Resend documentation](https://resend.com/docs)
- Contact the Cush support team
- For Resend-specific issues, contact Resend support

## Next Steps

After successfully setting up Resend:
- Customize email templates in `lib/email.ts`
- Set up email analytics in your Resend dashboard
- Consider implementing email verification for new user registrations
\`\`\`

Let's update the admin page:
