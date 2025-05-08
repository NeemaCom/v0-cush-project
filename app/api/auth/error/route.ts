/**
 * Simplified auth error handler
 */
export async function GET(request: Request) {
  // Get error from query parameters
  const url = new URL(request.url)
  const error = url.searchParams.get("error") || "unknown"

  // Basic error message
  const message = "Authentication error: " + error

  // Simple HTML response
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Auth Error</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto; }
          .error-box { border: 1px solid #f56565; background-color: #fff5f5; padding: 1rem; border-radius: 0.25rem; }
          h1 { color: #2d3748; }
        </style>
      </head>
      <body>
        <h1>Authentication Error</h1>
        <div class="error-box">
          <p>${message}</p>
        </div>
        <p><a href="/login">Return to login</a></p>
      </body>
    </html>
  `

  // Return simple HTML response
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  })
}

/**
 * Handle POST requests
 */
export async function POST(request: Request) {
  return GET(request)
}
