"use client"
export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, MessageCircle, Wrench, Bot } from "lucide-react"
import Sidebar from "../components/Sidebar"

const UserProfile = () => {
  const router = useRouter()
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePicture: "",
    address: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        } else {
          setError("Failed to fetch profile")
        }
      } catch {
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const featureCards = [
    {
      title: "Find User",
      icon: Search,
      description: "Search and connect with service ",
      action: () => router.push("/search"),
    },
    {
      title: "Messenger",
      icon: MessageCircle,
      description: "Chat with your service providers",
      action: () => router.push("/messenger?userId=" + localStorage.getItem("userId")),

    },
    {
      title: "Services",
      icon: Wrench,
      description: "Browse available services",
      action: () => router.push("/services"),
    },
    {
      title: "AI Assistant",
      icon: Bot,
      description: "Get help from our AI assistant",
      action: () => router.push("/chatbot"),
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-800"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-gray-800 font-bold text-lg">
                    {profile.name ? profile.name[0].toUpperCase() : "U"}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome to {profile.name || "User"} Dashboard</h1>
                <p className="text-gray-600">You can manage your services, messages, and connections here.</p>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">User Profile</h2>

            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-6">
                {profile.profilePicture ? (
                  <Image
                    src={profile.profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="rounded-full object-cover border-4 border-gray-800"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center border-4 border-gray-800">
                    <span className="text-gray-600 text-lg font-semibold">
                      {profile.name ? profile.name[0].toUpperCase() : "U"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Name</p>
                  <p className="text-lg font-semibold text-gray-800">{profile.name || "Not provided"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-800">{profile.email || "Not provided"}</p>
                </div>
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Address</p>
                  <p className="text-lg font-semibold text-gray-800">{profile.address || "Not provided"}</p>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => router.push("/user-profile")}
                  className="px-8 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition duration-300"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col items-start space-y-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <card.icon className="w-6 h-6 text-gray-800" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                  </div>
                  <button
                    onClick={card.action}
                    className="w-full px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Go to {card.title.toLowerCase()}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
