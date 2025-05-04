import { Redis } from "@upstash/redis"

// Function to get the correct Redis URL format
function getRedisUrl() {
  // First try the REST API URL (preferred for Upstash Redis client)
  const restApiUrl = process.env.KV_REST_API_URL || ""
  if (restApiUrl && restApiUrl.startsWith("https://")) {
    return restApiUrl
  }

  // If KV_URL is provided and it's in the wrong format, try to convert it
  const kvUrl = process.env.KV_URL || ""
  if (kvUrl && kvUrl.startsWith("rediss://")) {
    // Extract the hostname and credentials from the Redis URL
    try {
      const url = new URL(kvUrl)
      const hostname = url.hostname
      // Convert to Upstash REST API format (this is an approximation)
      return `https://${hostname}`
    } catch (error) {
      console.error("Failed to parse Redis URL:", error)
    }
  }

  // Fallback to a default or empty string
  console.warn("No valid Redis URL found in environment variables")
  return restApiUrl || ""
}

// Function to get the correct Redis token
function getRedisToken() {
  // First try the REST API token (preferred for Upstash Redis client)
  const restApiToken = process.env.KV_REST_API_TOKEN || ""
  if (restApiToken) {
    return restApiToken
  }

  // Try the read-only token as fallback
  const readOnlyToken = process.env.KV_REST_API_READ_ONLY_TOKEN || ""
  if (readOnlyToken) {
    console.warn("Using read-only token for Redis. Write operations will fail.")
    return readOnlyToken
  }

  // If KV_URL is provided, try to extract the password as a last resort
  const kvUrl = process.env.KV_URL || ""
  if (kvUrl && kvUrl.startsWith("rediss://")) {
    try {
      const url = new URL(kvUrl)
      const password = url.password
      if (password) {
        console.warn("Extracted password from Redis URL. This may not work with Upstash REST API.")
        return password
      }
    } catch (error) {
      console.error("Failed to parse Redis URL for password:", error)
    }
  }

  console.warn("No valid Redis token found in environment variables")
  return ""
}

// Initialize Redis client with more robust configuration
let redisClient: Redis | null = null

try {
  redisClient = new Redis({
    url: getRedisUrl(),
    token: getRedisToken(),
    retry: {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 3000,
    },
  })
  console.log("Redis client initialized successfully")
} catch (error) {
  console.error("Failed to initialize Redis client:", error)
}

// Export the Redis client with a fallback
export const redis = redisClient || new Redis({ url: "", token: "" })

// Test Redis connection with detailed error reporting
export async function testRedisConnection() {
  try {
    // Check if Redis client was initialized
    if (!redisClient) {
      return {
        success: false,
        message: "Redis client not initialized",
        config: {
          url: getRedisUrl() ? "URL provided" : "URL missing",
          token: getRedisToken() ? "Token provided" : "Token missing",
        },
      }
    }

    // Try a simple PING command
    const pingResult = await redis.ping()
    console.log("Redis ping result:", pingResult)

    // Try a simple SET/GET operation
    const testKey = "test:connection:" + Date.now()
    const testValue = "connected-" + Date.now()
    await redis.set(testKey, testValue, { ex: 60 }) // Expire in 60 seconds
    const retrievedValue = await redis.get(testKey)

    return {
      success: true,
      message: "Redis connection successful",
      pingResult,
      testKey,
      testValue,
      retrievedValue,
      config: {
        url: getRedisUrl() ? "URL provided" : "URL missing",
        token: getRedisToken() ? "Token provided" : "Token missing",
      },
    }
  } catch (error) {
    console.error("Redis connection test error:", error)
    return {
      success: false,
      message: "Redis connection failed",
      error: String(error),
      config: {
        url: getRedisUrl() ? "URL provided" : "URL missing",
        token: getRedisToken() ? "Token provided" : "Token missing",
      },
    }
  }
}

// Wrap Redis operations in try-catch blocks for better error handling
export async function savePayment(paymentId: string, payment: any) {
  try {
    await redis.set(`payment:${paymentId}`, JSON.stringify(payment))
    return true
  } catch (error) {
    console.error(`Failed to save payment ${paymentId}:`, error)
    return false
  }
}

export async function getPayment(paymentId: string) {
  try {
    const payment = await redis.get(`payment:${paymentId}`)
    return payment ? JSON.parse(payment as string) : null
  } catch (error) {
    console.error(`Failed to get payment ${paymentId}:`, error)
    return null
  }
}

export async function getApplication(applicationType: string, applicationId: string) {
  try {
    const application = await redis.get(`application:${applicationType}:${applicationId}`)
    return application ? JSON.parse(application as string) : null
  } catch (error) {
    console.error(`Failed to get application ${applicationType}:${applicationId}:`, error)
    return null
  }
}

export async function saveApplication(applicationType: string, applicationId: string, application: any) {
  try {
    await redis.set(`application:${applicationType}:${applicationId}`, JSON.stringify(application))
    return true
  } catch (error) {
    console.error(`Failed to save application ${applicationType}:${applicationId}:`, error)
    return false
  }
}

export async function getUserApplications(type: string, userId: string) {
  try {
    const pattern = `application:${type}:*`
    const keys = await redis.keys(pattern)

    const applications = []
    for (const key of keys) {
      const data = await redis.get(key)
      if (data) {
        const application = JSON.parse(data as string)
        if (application.userId === userId) {
          applications.push(application)
        }
      }
    }

    return applications
  } catch (error) {
    console.error(`Failed to get user applications for ${userId}:`, error)
    return []
  }
}

// Add a function to check if Redis is working and provide fallback data if needed
export async function safeRedisOperation<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error("Redis operation failed, using fallback data:", error)
    return fallback
  }
}
