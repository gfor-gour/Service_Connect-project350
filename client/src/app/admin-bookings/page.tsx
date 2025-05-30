"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import AdminSidebar from "../components/admin-sidebar"

interface Booking {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
  }
  providerId: {
    _id: string
    name: string
    email: string
    workType: string
  }
  description: string
  status: string
  price?: number
  paymentStatus: string
  createdAt: string
}

export default function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn || isLoggedIn !== "true") {
      router.push("/admin-login")
      return
    }

    fetchBookings()
  }, [router])

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/bookings/bookings`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      } else {
        setError("Failed to fetch bookings")
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setError("Error connecting to server")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "default"
      case "rejected":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "success":
        return "default"
      case "failed":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar onToggle={(expanded) => setSidebarExpanded(expanded)} />

      <div className={`w-full transition-all duration-300 ${sidebarExpanded ? "md:ml-64" : "md:ml-14"} p-4 md:p-8`}>
        <div className="mb-6 md:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Manage Bookings</h1>
              <p className="text-sm md:text-base text-gray-600">View and manage all booking requests</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">All Bookings ({bookings.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-4 overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">Loading bookings...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.userId?.name || "N/A"}</div>
                            <div className="text-xs md:text-sm text-gray-500">{booking.userId?.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.providerId?.name || "N/A"}</div>
                            <div className="text-xs md:text-sm text-gray-500">{booking.providerId?.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[100px] md:max-w-xs truncate">{booking.description}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                        </TableCell>
                        <TableCell>{booking.price ? `৳${booking.price}` : "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={getPaymentStatusBadgeVariant(booking.paymentStatus)}>
                            {booking.paymentStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}