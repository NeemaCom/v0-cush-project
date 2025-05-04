// In-memory storage as fallback when Redis is unavailable
// Note: This is not persistent and will be cleared on server restart
// Only use this for development or as a temporary fallback

const inMemoryStore = new Map<string, any>()

export function getInMemoryStore() {
  return inMemoryStore
}

export function setInMemoryValue(key: string, value: any, expiresInSeconds?: number) {
  inMemoryStore.set(key, {
    value,
    expiresAt: expiresInSeconds ? Date.now() + expiresInSeconds * 1000 : null,
  })

  // Set up expiration if needed
  if (expiresInSeconds) {
    setTimeout(() => {
      inMemoryStore.delete(key)
    }, expiresInSeconds * 1000)
  }

  return true
}

export function getInMemoryValue(key: string) {
  const item = inMemoryStore.get(key)

  // Check if item exists
  if (!item) return null

  // Check if item has expired
  if (item.expiresAt && item.expiresAt < Date.now()) {
    inMemoryStore.delete(key)
    return null
  }

  return item.value
}

export function deleteInMemoryValue(key: string) {
  return inMemoryStore.delete(key)
}

// Helper functions that mirror Redis functions
export async function fallbackSaveApplication(type: string, id: string, data: any) {
  const key = `application:${type}:${id}`
  return setInMemoryValue(key, data)
}

export async function fallbackGetApplication(type: string, id: string) {
  const key = `application:${type}:${id}`
  return getInMemoryValue(key)
}

export async function fallbackGetUserApplications(type: string, userId: string) {
  const applications = []

  // Iterate through all items in the store
  for (const [key, item] of inMemoryStore.entries()) {
    if (key.startsWith(`application:${type}:`) && item.value.userId === userId) {
      applications.push(item.value)
    }
  }

  return applications
}
