"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import Sidebar from "../components/Sidebar"

interface Review {
  _id: string
  userId: {
    _id: string
    name: string
    profilePicture?: string
  }
  rating: number
  comment: string
  createdAt: string
}

const ProviderPage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePicture: "",
    address: "",
    workType: "",
  })
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState<number>(0)
  const [totalReviews, setTotalReviews] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(true)
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
          await fetchReviews(data._id || localStorage.getItem("userId"))
        } else {
          setError("Failed to fetch profile")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const fetchReviews = async (providerId: string) => {
    try {
      setReviewsLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/reviews/provider/${providerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
        setAverageRating(data.averageRating)
        setTotalReviews(data.totalReviews)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setReviewsLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white text-gray-800">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-800"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-white text-gray-800">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
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
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 md:mb-8 text-gray-800 text-center">
              Provider Profile
            </h1>

            <div className="flex flex-col items-center mb-6 md:mb-8">
              <div className="relative mb-4 md:mb-6">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-800 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-800 shadow-lg">
                    <span className="text-2xl md:text-4xl font-bold text-gray-800">
                      {profile.name ? profile.name[0].toUpperCase() : "U"}
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center">
                {profile.name || "Your Name"}
              </h2>
              <p className="text-gray-600 mb-4 text-center">{profile.email || "Your Email"}</p>

              {/* Rating Summary */}
              <div className="text-center mb-6 md:mb-8">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-lg font-semibold text-gray-800">{averageRating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-500">{totalReviews} total reviews</p>
              </div>

              {/* Work Type and Address */}
              <div className="w-full max-w-2xl space-y-4">
                <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-2">Work Type</p>
                  <p className="text-lg md:text-xl font-semibold text-gray-800 capitalize">
                    {profile.workType || "Not Specified"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-2">Address</p>
                  <p className="text-lg md:text-xl font-semibold text-gray-800">{profile.address || "Not Provided"}</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-6 md:mt-8">
              <button
                onClick={() => (window.location.href = "/provider-profile")}
                className="px-6 md:px-8 py-3 text-base md:text-lg font-bold text-white bg-gray-800 rounded-xl shadow-md hover:bg-gray-700 transition duration-200 w-full sm:w-auto"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>

              {/* Rating Summary Card */}
              <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      {renderStars(Math.round(averageRating))}
                      <span className="text-2xl md:text-3xl font-bold text-gray-800">{averageRating.toFixed(1)}</span>
                    </div>
                    <p className="text-gray-600">Based on {totalReviews} reviews</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-500">Overall Rating</p>
                    <p className="text-lg md:text-xl font-semibold text-gray-800">
                      {averageRating > 4.5
                        ? "Excellent"
                        : averageRating > 3.5
                          ? "Good"
                          : averageRating > 2.5
                            ? "Average"
                            : averageRating > 0
                              ? "Needs Improvement"
                              : "No Rating"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Star className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No reviews yet</h3>
                <p className="text-gray-500">
                  When customers leave reviews about your services, they&apos;ll appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow bg-gray-50"
                  >
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {review.userId.profilePicture ? (
                          <Image
                            src={review.userId.profilePicture || "/placeholder.svg"}
                            alt={review.userId.name}
                            width={48}
                            height={48}
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-gray-800 text-sm md:text-lg font-semibold">
                            {review.userId.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-800 truncate">{review.userId.name}</h4>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-1 space-y-1 sm:space-y-0">
                              {renderStars(review.rating)}
                              <span className="text-xs md:text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm md:text-base">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProviderPage
