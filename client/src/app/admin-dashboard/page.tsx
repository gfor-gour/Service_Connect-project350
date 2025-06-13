"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, UserCheck, Users, Settings } from "lucide-react"
import AdminSidebar from "../components/admin-sidebar"

export default function AdminDashboard() {
  const router = useRouter()
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin-login")
    }
  }, [router])

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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar onToggle={(expanded) => setSidebarExpanded(expanded)} />

      <div className={`w-full transition-all duration-300 ${sidebarExpanded ? "md:ml-64" : "md:ml-14"} p-4 md:p-8`}>
        <div className="mb-6 md:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Welcome to ServiceConnect Dashboard</h1>
              <p className="text-sm md:text-base text-gray-600">You can manage your users, providers, and bookings here.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {managementOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <CardHeader className="pb-2 md:pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 md:w-10 md:h-10 ${option.color} rounded-lg flex items-center justify-center`}>
                    <option.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <CardTitle className="text-base md:text-lg">{option.title}</CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm text-gray-600">{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push(option.href)} className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                  Go to manage 
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}