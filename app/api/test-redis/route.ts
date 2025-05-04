import { NextResponse } from "next/server"
import { testRedisConnection } from "@/lib/redis"

export async function GET() {
  try {
    const result = await testRedisConnection()

    // Add environment variable information (without exposing sensitive values)
    const envInfo = {
      KV_REST_API_URL: process.env.KV_REST_API_URL ? "Set" : "Not set",
      KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? "Set" : "Not set",
      KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN ? "Set" : "Not set",
      KV_URL: process.env.KV_URL ? "Set" : "Not set",
      REDIS_URL: process.env.REDIS_URL ? "Set" : "Not set",
    }

    return NextResponse.json({
      ...result,
      environmentVariables: envInfo,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test Redis API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to test Redis connection",
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
