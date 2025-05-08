import { Redis } from "@upstash/redis"

// Initialize Redis client
export const redis = new Redis({
  url: process.env.REDIS_URL || process.env.KV_URL || "",
  token: process.env.REDIS_TOKEN || process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN || "",
})

/**
 * Test Redis connection
 * @returns {Promise<{success: boolean, message: string}>} Connection status
 */
export async function testRedisConnection() {
  try {
    // Try to ping Redis
    const result = await redis.ping()
    return {
      success: true,
      message: `Redis connection successful: ${result}`,
    }
  } catch (error) {
    console.error("Redis connection error:", error)
    return {
      success: false,
      message: `Redis connection failed: ${error.message}`,
    }
  }
}

/**
 * Save an application to Redis
 * @param {string} type - The application type
 * @param {string} id - The application ID
 * @param {Object} data - The application data
 * @returns {Promise<string>} - The application ID
 */
export async function saveApplication(type, id, data) {
  const key = `application:${type}:${id}`
  await redis.set(key, JSON.stringify(data))

  // Add to user's applications list
  if (data.userId) {
    await redis.lpush(`user:${data.userId}:applications:${type}`, id)
  }

  return id
}

/**
 * Get an application from Redis
 * @param {string} type - The application type
 * @param {string} id - The application ID
 * @returns {Promise<Object|null>} - The application data
 */
export async function getApplication(type, id) {
  const key = `application:${type}:${id}`
  const data = await redis.get(key)
  return data ? JSON.parse(data) : null
}

/**
 * Get all applications for a user
 * @param {string} userId - The user ID
 * @param {string} type - The application type
 * @returns {Promise<Array>} - Array of application data
 */
export async function getUserApplications(userId, type) {
  const applicationIds = await redis.lrange(`user:${userId}:applications:${type}`, 0, -1)

  if (!applicationIds.length) return []

  const applications = []

  for (const id of applicationIds) {
    const application = await getApplication(type, id)
    if (application) {
      applications.push(application)
    }
  }

  return applications
}

/**
 * Save payment information to Redis
 * @param {string} id - The payment ID
 * @param {Object} data - The payment data
 * @returns {Promise<string>} - The payment ID
 */
export async function savePayment(id, data) {
  const key = `payment:${id}`
  await redis.set(key, JSON.stringify(data))

  // Add to user's payments list if userId is provided
  if (data.userId) {
    await redis.lpush(`user:${data.userId}:payments`, id)
  }

  return id
}

/**
 * Get payment information from Redis
 * @param {string} id - The payment ID
 * @returns {Promise<Object|null>} - The payment data
 */
export async function getPayment(id) {
  const key = `payment:${id}`
  const data = await redis.get(key)
  return data ? JSON.parse(data) : null
}

/**
 * Get all payments for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Array of payment data
 */
export async function getUserPayments(userId) {
  const paymentIds = await redis.lrange(`user:${userId}:payments`, 0, -1)

  if (!paymentIds.length) return []

  const payments = []

  for (const id of paymentIds) {
    const payment = await getPayment(id)
    if (payment) {
      payments.push(payment)
    }
  }

  return payments
}
