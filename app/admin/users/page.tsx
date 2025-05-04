"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, formatDistanceToNow } from "date-fns"
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCog,
  User,
  Search,
  MapPin,
  Clock,
  Calendar,
  Phone,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

type UserType = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  country: string
  phoneNumber: string
  createdAt: string
  lastLoginAt?: string
  lastActiveAt?: string
  ipAddress?: string
  userAgent?: string
  loginCount?: number
}

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth({ required: true })
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/users?page=${page}&limit=10`)
        const data = await response.json()

        if (data.success) {
          setUsers(data.users)
          setTotalPages(data.pagination.totalPages)
        }
      } catch (error) {
        console.error("Failed to fetch users:", error)
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user?.role === "admin") {
      fetchUsers()
    } else if (!isLoading && user?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin users page",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [user, isLoading, router, toast, page])

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User role updated successfully",
        })

        // Update the user in the state
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)))

        if (selectedUser?.id === userId) {
          setSelectedUser((prev) => (prev ? { ...prev, role } : null))
        }
      }
    } catch (error) {
      console.error("Failed to update user role:", error)
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  const handleUserClick = (user: UserType) => {
    setSelectedUser(user)
  }

  const handleBack = () => {
    setSelectedUser(null)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-500" />
      case "support":
        return <UserCog className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user?.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Shield className="h-16 w-16 text-yellow-500 mx-auto" />
        <h1 className="text-2xl font-bold mt-4">Access Denied</h1>
        <p className="text-gray-500 mt-2">You don't have permission to access this page</p>
        <Button className="mt-6" onClick={() => router.push("/dashboard")}>
          Return to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center">
          <Users className="h-8 w-8 mr-2" />
          <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
        </div>
        <p className="text-gray-500">Manage and monitor registered users</p>
      </header>

      {selectedUser ? (
        <div>
          <Button variant="outline" onClick={handleBack} className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to User List
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Profile</CardTitle>
                  <Badge
                    variant={
                      selectedUser.role === "admin"
                        ? "destructive"
                        : selectedUser.role === "support"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {selectedUser.role}
                  </Badge>
                </div>
                <CardDescription>User account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="text-2xl">
                      {selectedUser.firstName[0]}
                      {selectedUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Registered</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(selectedUser.createdAt), "PPP")}(
                        {formatDistanceToNow(new Date(selectedUser.createdAt), { addSuffix: true })})
                      </p>
                    </div>
                  </div>

                  {selectedUser.lastActiveAt && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Last Active</p>
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(selectedUser.lastActiveAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedUser.ipAddress && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">IP Address</p>
                        <p className="text-sm text-gray-500">{selectedUser.ipAddress}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-500">{selectedUser.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Manage user permissions and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">User Role</h3>
                    <div className="flex items-center space-x-2">
                      <Select
                        defaultValue={selectedUser.role}
                        onValueChange={(value) => handleUpdateRole(selectedUser.id, value)}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        Current role: <Badge variant="outline">{selectedUser.role}</Badge>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Activity Information</h3>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Registration Date</TableCell>
                          <TableCell>{format(new Date(selectedUser.createdAt), "PPP pp")}</TableCell>
                        </TableRow>
                        {selectedUser.lastLoginAt && (
                          <TableRow>
                            <TableCell className="font-medium">Last Login</TableCell>
                            <TableCell>{format(new Date(selectedUser.lastLoginAt), "PPP pp")}</TableCell>
                          </TableRow>
                        )}
                        {selectedUser.lastActiveAt && (
                          <TableRow>
                            <TableCell className="font-medium">Last Active</TableCell>
                            <TableCell>{format(new Date(selectedUser.lastActiveAt), "PPP pp")}</TableCell>
                          </TableRow>
                        )}
                        {selectedUser.loginCount && (
                          <TableRow>
                            <TableCell className="font-medium">Login Count</TableCell>
                            <TableCell>{selectedUser.loginCount}</TableCell>
                          </TableRow>
                        )}
                        <TableRow>
                          <TableCell className="font-medium">Country</TableCell>
                          <TableCell>{selectedUser.country}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Actions</h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/admin/users/${selectedUser.id}/activities`)}
                      >
                        View Activity Log
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/admin/users/${selectedUser.id}/documents`)}
                      >
                        View Documents
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/admin/users/${selectedUser.id}/applications`)}
                      >
                        View Applications
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="hidden md:table-cell">Registered</TableHead>
                        <TableHead className="hidden md:table-cell">Last Active</TableHead>
                        <TableHead className="hidden md:table-cell">Country</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id} onClick={() => handleUserClick(user)} className="cursor-pointer">
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {user.firstName[0]}
                                    {user.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                {getRoleIcon(user.role)}
                                <span className="capitalize">{user.role}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {user.lastActiveAt
                                ? formatDistanceToNow(new Date(user.lastActiveAt), { addSuffix: true })
                                : "N/A"}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{user.country}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleUserClick(user)
                                }}
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-gray-500">
                      Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
