"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Sidebar from "../../components/Sidebar"

interface Provider {
  _id: string
  name: string
  email: string
  workType?: string
  profilePicture?: string
  address: string
}

interface Booking {
  _id: string
  providerId: Provider
  description: string
  status: string
  price?: number
  createdAt: string
  paymentStatus: string
}

interface UserDetails {
  name: string
  address: string
}

export default function BookingPage() {
  const { userId } = useParams()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [description, setDescription] = useState("")
  const [bookingStatus, setBookingStatus] = useState<string>("Pending")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([])
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const fetchProviderDetails = async () => {
        try {
          const token = localStorage.getItem("token")
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (!response.ok) throw new Error("Failed to fetch provider details")
          const data = await response.json()
          setProvider(data)
        } catch (error) {
          console.error("Error fetching provider details:", error)
        }
      }

      const fetchBookingHistory = async () => {
        try {
          const token = localStorage.getItem("token")
          const currentUserId = localStorage.getItem("userId")

          if (!currentUserId) return

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/bookings/user/${currentUserId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          if (!response.ok) throw new Error("Failed to fetch booking history")

          const data = await response.json()

          // Filter bookings to show only those between current user and the specific provider
          const filteredBookings = data.filter(
            (booking: Booking) => booking.providerId._id === userId,
          )

          setBookingHistory(filteredBookings)
        } catch (error) {
          console.error("Error fetching booking history:", error)
        }
      }

      const fetchProviderBookings = async () => {
        try {
          const token = localStorage.getItem("token")
          const currentUserId = localStorage.getItem("userId")

          if (!currentUserId) return

          // If the current user is viewing their own provider profile, also fetch bookings where they are the provider
          if (currentUserId === userId) {
            const providerResponse = await fetch(
              `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/bookings/provider/${userId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            )

            if (providerResponse.ok) {
              const providerBookings = await providerResponse.json()
              setBookingHistory((prev) => [...prev, ...providerBookings])
            }
          }
        } catch (error) {
          console.error("Error fetching provider bookings:", error)
        }
      }

      await fetchProviderDetails()
      await fetchBookingHistory()
      await fetchProviderBookings() // Add this line
      await fetchUserDetails()

      async function fetchUserDetails() {
        try {
          const token = localStorage.getItem("token")
          const currentUserId = localStorage.getItem("userId")

          if (!currentUserId) return

          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/${currentUserId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (!response.ok) throw new Error("Failed to fetch user details")
          const data = await response.json()
          setUserDetails(data)
        } catch (error) {
          console.error("Error fetching user details:", error)
        }
      }
    }

    fetchData()
  }, [userId])

  const handleBookingRequest = async () => {
    try {
      if (isProcessing) return
      const token = localStorage.getItem("token")
      const currentUserId = localStorage.getItem("userId")

      if (!provider || !currentUserId || !description.trim()) {
        alert("Please provide all details before booking!")
        return
      }

      setIsProcessing(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/bookings/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: currentUserId,
          providerId: provider._id,
          description,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to send booking request")

      alert("Booking request sent successfully!")
      setBookingHistory((prev) => [...prev, data.booking])
      setBookingStatus("Booked")
    } catch (error) {
      console.error("Error sending booking request:", error)
      alert("Failed to send booking request!")
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayment = async (booking: Booking) => {
    try {
      if (booking.paymentStatus === "success") {
        alert("Payment already successful for this booking.")
        return
      }

      const token = localStorage.getItem("token")
      const currentUserId = localStorage.getItem("userId")

      const paymentData = {
        userId: currentUserId,
        price: booking.price,
        address: userDetails?.address,
        name: userDetails?.name,
        bookingId: booking._id,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/transactions/sslcommerz/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to initiate payment")

      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Payment initiation failed. No redirect URL received.")
      }
    } catch (error) {
      console.error("Error initiating payment:", error)
      alert("Failed to initiate payment!")
    }
  }


  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-white">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 text-gray-800">Book Provider</h1>

          {provider ? (
            <div className="bg-white dark:bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 sm:mb-8">
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 sm:mb-0 sm:mr-6 shadow-md">
                  {provider.profilePicture ? (
                    <Image
                      src={provider.profilePicture || "/placeholder.svg"}
                      alt={provider.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-gray-800 text-3xl font-bold">{provider.name.charAt(0)}</span>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{provider.name}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{provider.email}</p>
                  {provider.workType && <p className="text-sm text-gray-700">{provider.workType}</p>}
                </div>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg mb-6 focus:ring-2 focus:ring-gray-800 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter booking details..."
              />

              <button
                onClick={handleBookingRequest}
                disabled={bookingStatus === "Booked" || isProcessing}
                className="bg-gray-800 text-white px-6 py-3 rounded-lg w-full hover:bg-gray-900 transition text-sm sm:text-base"
              >
                {isProcessing ? "Processing..." : bookingStatus === "Booked" ? "Already Booked" : "Book Now"}
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-600">Loading provider information...</p>
          )}

          {bookingHistory.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Booking History</h2>
              <div className="space-y-4">
                {bookingHistory.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white border border-gray-200 p-4 sm:p-6 rounded-lg shadow-md text-sm sm:text-base"
                  >
                    <p>
                      <strong>Provider:</strong> {booking.providerId.name}
                    </p>
                    <p>
                      <strong>Status:</strong> {booking.status}
                    </p>
                    <p>
                      <strong>Description:</strong> {booking.description}
                    </p>
                    {booking.price && (
                      <p>
                        <strong>Price:</strong> {booking.price} BDT
                      </p>
                    )}
                    <p className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Payment Status: {booking.paymentStatus}</p>

                    {booking.status === "accepted" && booking.paymentStatus !== "success" && booking.price && (
                      <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => handlePayment(booking)}
                          disabled={booking.paymentStatus === "success"}
                          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
                        >
                          Pay {booking.price} BDT
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
