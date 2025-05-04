"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Notification } from "@/lib/notifications"
import { useSocket } from "@/hooks/use-socket"
import { useToast } from "@/hooks/use-toast"

export function NotificationBell() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const { socket, isConnected } = useSocket()
  const { toast } = useToast()

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/notifications?limit=10`)
      const data = await response.json()

      if (data.success) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "POST",
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId ? { ...notification, read: true } : notification,
          ),
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`/api/notifications/read-all`, {
        method: "POST",
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  // Fetch notifications on mount and when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications()
    }
  }, [session?.user?.id])

  // Set up socket listeners for real-time notifications
  useEffect(() => {
    if (socket && isConnected) {
      // Listen for new notifications
      socket.on("notification", (notification) => {
        // Add the new notification to the list
        setNotifications((prev) => [notification, ...prev])
        setUnreadCount((prev) => prev + 1)

        // Show a toast notification
        toast({
          title: notification.title,
          description: notification.message,
          variant: notification.type === "error" ? "destructive" : "default",
        })
      })

      // Listen for document status updates
      socket.on("document-status-update", (document) => {
        toast({
          title: "Document Status Updated",
          description: `Document "${document.name}" has been ${document.status}`,
          variant: document.status === "approved" ? "default" : "destructive",
        })
      })

      // Listen for application status updates
      socket.on("application-status-update", (application) => {
        toast({
          title: "Application Status Updated",
          description: `Your application has been ${application.status}`,
          variant: application.status === "approved" ? "default" : "destructive",
        })
      })

      return () => {
        socket.off("notification")
        socket.off("document-status-update")
        socket.off("application-status-update")
      }
    }
  }, [socket, isConnected, toast])

  // Fetch notifications when popover opens
  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          {isConnected && <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-20">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-sm text-gray-500">No notifications</div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onRead={markAsRead} />
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t text-center">
          <Button variant="ghost" size="sm" asChild className="w-full">
            <a href="/dashboard/notifications">View all notifications</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification
  onRead: (id: string) => void
}) {
  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id)
    }
  }

  return (
    <div
      className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-2">
        <div className={`w-2 h-2 mt-2 rounded-full ${!notification.read ? "bg-primary" : "bg-transparent"}`} />
        <div className="flex-1">
          <h4 className="text-sm font-medium">{notification.title}</h4>
          <p className="text-sm text-gray-500">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
