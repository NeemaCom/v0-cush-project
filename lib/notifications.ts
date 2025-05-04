import { redis } from "./redis"

export type Notification = {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: number
  link?: string
}

export async function createNotification(
  notification: Omit<Notification, "id" | "createdAt" | "read">,
): Promise<Notification> {
  const id = crypto.randomUUID()
  const createdAt = Date.now()

  const newNotification: Notification = {
    ...notification,
    id,
    createdAt,
    read: false,
  }

  await redis.set(`notification:${id}`, JSON.stringify(newNotification))
  await redis.sadd(`user:${notification.userId}:notifications`, id)

  return newNotification
}

export async function getNotification(id: string): Promise<Notification | null> {
  const notification = await redis.get(`notification:${id}`)
  return notification ? JSON.parse(notification as string) : null
}

export async function getUserNotifications(userId: string, limit = 10, offset = 0): Promise<Notification[]> {
  const notificationIds = await redis.smembers(`user:${userId}:notifications`)

  if (!notificationIds.length) {
    return []
  }

  const notifications: Notification[] = []

  for (const id of notificationIds) {
    const notification = await getNotification(id as string)
    if (notification) {
      notifications.push(notification)
    }
  }

  // Sort by createdAt in descending order (newest first)
  const sortedNotifications = notifications.sort((a, b) => b.createdAt - a.createdAt)

  // Apply limit and offset
  return sortedNotifications.slice(offset, offset + limit)
}

export async function markNotificationAsRead(id: string, userId: string): Promise<boolean> {
  const notification = await getNotification(id)

  if (!notification) {
    return false
  }

  if (notification.userId !== userId) {
    return false
  }

  notification.read = true
  await redis.set(`notification:${id}`, JSON.stringify(notification))

  return true
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const notifications = await getUserNotifications(userId)

  if (!notifications.length) {
    return false
  }

  for (const notification of notifications) {
    await markNotificationAsRead(notification.id, userId)
  }

  return true
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const notifications = await getUserNotifications(userId)
  return notifications.filter((notification) => !notification.read).length
}

export async function deleteNotification(id: string): Promise<boolean> {
  const notification = await getNotification(id)

  if (!notification) {
    return false
  }

  await redis.del(`notification:${id}`)
  await redis.srem(`user:${notification.userId}:notifications`, id)

  return true
}
