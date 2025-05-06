import { type NextRequest, NextResponse } from "next/server"

/**
 * Handles authentication error requests
 * @param request The incoming request
 * @returns A JSON response with error details
 */
export async function GET(request: NextRequest) {
  try {
    // Get error from query parameters
    const url = new URL(request.url)
    const error = url.searchParams.get("error") || "unknown"
    const errorDescription = url.searchParams.get("error_description") || "No additional details available"

    // Log the full request for debugging
    console.log("Auth error request:", {
      url: request.url,
      error,
      errorDescription,
      headers: Object.fromEntries(request.headers),
    })

    // Map error codes to user-friendly messages
    let message = "An authentication error occurred"
    switch (error) {
      case "Configuration":
        message = "There is a problem with the server configuration."
        break
      case "AccessDenied":
        message = "You do not have permission to sign in."
        break
      case "Verification":
        message = "The verification link is invalid or has expired."
        break
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
      case "Callback":
      case "OAuthAccountNotLinked":
      case "EmailSignin":
      case "CredentialsSignin":
        message = "There was a problem with your sign-in attempt. Please try again."
        break
      case "SessionRequired":
        message = "You must be signed in to access this page."
        break
      default:
        message = "An unexpected authentication error occurred."
    }

    // Return a JSON response with detailed error information
    return NextResponse.json(
      {
        status: "error",
        error: error,
        message: message,
        description: errorDescription,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200, // Changed from 400 to 200 to ensure the response is properly received
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (err) {
    // Handle any unexpected errors in the route itself
    console.error("Error in auth error route:", err)
    return NextResponse.json(
      {
        status: "error",
        error: "internal_server_error",
        message: "An internal server error occurred while processing the authentication error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 200, // Changed from 500 to 200 to ensure the response is properly received
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

/**
 * Handle POST requests by redirecting to GET handler
 */
export async function POST(request: NextRequest) {
  return GET(request)
}
