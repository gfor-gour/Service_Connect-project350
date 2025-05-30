"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, Calendar, LogOut, Settings } from "lucide-react"

export default function AdminDashboard() {
  const [adminUsername, setAdminUsername] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken")

    if (!token) {
      router.push("/admin-login")
      return
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin-login")
  }

  const managementOptions = [
    {
      title: "Manage Users",
      description: "View and manage all registered users",
      icon: Users,
      href: "/admin-users",
      color: "bg-blue-500",
    },
    {
      title: "Manage Providers",
      description: "View and manage service providers",
      icon: UserCheck,
      href: "/admin-providers",
      color: "bg-green-500",
    },
    {
      title: "Manage Bookings",
      description: "View and manage all booking requests",
      icon: Calendar,
      href: "/admin-bookings",
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ServiceConnect</span>
          </div>
        </div>

        <nav className="mt-8">
          <div className="px-6 py-2">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg mb-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Dashboard</span>
            </div>

            <div className="space-y-1 mt-4">
              <button
                onClick={() => router.push("/admin-users")}
                className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5" />
                <span>Manage Users</span>
              </button>

              <button
                onClick={() => router.push("/admin-providers")}
                className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <UserCheck className="w-5 h-5" />
                <span>Manage Providers</span>
              </button>

              <button
                onClick={() => router.push("/admin-bookings")}
                className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span>Manage Bookings</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Admin Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Welcome, Admin!</div>
          <div className="text-xs text-gray-500 mb-3">{adminUsername}</div>
          <div className="text-xs text-gray-500 mb-3">Role: admin</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Log out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome to ServiceConnect Dashboard</h1>
              <p className="text-gray-600">You can manage your users, providers, and bookings here.</p>
            </div>
          </div>
        </div>

        {/* Management Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${option.color} rounded-lg flex items-center justify-center`}>
                    <option.icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                </div>
                <CardDescription className="text-sm text-gray-600">{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push(option.href)} className="w-full bg-blue-600 hover:bg-blue-700">
                  Go to dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
