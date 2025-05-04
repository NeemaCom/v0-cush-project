"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Activity, Globe, Monitor } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

interface UserActivity {
  id: string
  userId: string
  timestamp: string
  type: string
  ipAddress?: string
  userAgent?: string
  path?: string
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}

export default function UserActivitiesPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { toast } = useToast()
  const { user: currentUser, isLoading } = useAuth({ required: true })
  const [user, setUser] = useState<User | null>(null)
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/users/${id}?activities=true`)

        if (!response.ok) {
          throw new Error("Failed to fetch user activities")
        }

        const data = await response.json()

        if (data.success) {
          setUser(data.user)
          setActivities(data.activities || [])
        }
      } catch (error) {
        console.error("Error fetching user activities:", error)
        toast({
          title: "Error",
          description: "Failed to fetch user activities",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (currentUser?.role === "admin") {
      fetchUserActivities()
    } else if (!isLoading && currentUser?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [id, currentUser, isLoading, router, toast])

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (currentUser?.role !== "admin") {
    return null // Redirect handled in useEffect
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          User Activity Log: {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-500">{user?.email}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>Recent user activity and login events</CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No activity recorded</h3>
              <p className="text-gray-500">This user has no recorded activity yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {activities.map((activity) => (
                <div key={activity.id} className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Activity className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium">{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</div>
                    <div className="text-sm text-gray-500">{format(new Date(activity.timestamp), "PPP 'at' p")}</div>
                    {activity.path && (
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Globe className="mr-1 h-4 w-4" />
                        Path: {activity.path}
                      </div>
                    )}
                    {activity.ipAddress && (
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Monitor className="mr-1 h-4 w-4" />
                        IP: {activity.ipAddress}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
