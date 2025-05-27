"use client"
export const dynamic = "force-dynamic"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import Sidebar from "../components/Sidebar"

const services = [
  { name: "Electricians", image: "/electrician.jpeg", category: "electrician" },
  { name: "Plumbers", image: "/plumber.jpeg", category: "plumber" },
  { name: "Babysitters", image: "/babysitter.jpeg", category: "babysitter" },
  { name: "Home Cleaners", image: "/cleaner.jpeg", category: "cleaner" },
]

interface Provider {
  _id: string
  name: string
  workType: string
  rating?: number
  averageRating?: number
  totalReviews?: number
}

function ServicesPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  const fetchProviders = async (category: string) => {
    setLoading(true)
    setError(null)

    try {
      let token: string | null = null

      // Access localStorage only in the browser
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/search?query=${category}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch providers")
      }

      const data = await response.json()

      // Fetch ratings for each provider
      const providersWithRatings = await Promise.all(
        data.map(async (provider: Provider) => {
          try {
            const reviewsResponse = await fetch(
              `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/reviews/provider/${provider._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            )

            if (reviewsResponse.ok) {
              const reviewsData = await reviewsResponse.json()
              return {
                ...provider,
                averageRating: reviewsData.averageRating || 0,
                totalReviews: reviewsData.totalReviews || 0,
              }
            }
            return { ...provider, averageRating: 0, totalReviews: 0 }
          } catch (error) {
            console.error(`Error fetching reviews for provider ${provider._id}:`, error)
            return { ...provider, averageRating: 0, totalReviews: 0 }
          }
        }),
      )

      setProviders(providersWithRatings)
      setSelectedCategory(category)
      setIsModalOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setProviders([])
    setSelectedCategory(null)
  }

  const handleBookNow = (userId: string) => {
    router.push(`/booking/${userId}`)
  }

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Our Services</h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
          Explore our wide range of services and find the perfect provider for your needs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="relative group">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  className="w-full h-64 object-cover opacity-90 group-hover:opacity-100 transition"
                />
                <div className="absolute inset-0 bg-gray-800/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <h3 className="text-xl font-bold text-white">{service.name}</h3>
                </div>
              </div>
              <div className="p-4 text-center">
                <button
                  onClick={() => fetchProviders(service.category)}
                  className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition w-full"
                >
                  View {service.category}
                </button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedCategory
                    ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Providers`
                    : "Providers"}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                    <span className="ml-3 text-gray-600">Loading providers...</span>
                  </div>
                ) : error ? (
                  <p className="text-center text-red-600 py-8">{error}</p>
                ) : (
                  <div className="space-y-4">
                    {providers.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No providers found for this category.</p>
                    ) : (
                      providers.map((provider) => (
                        <div
                          key={provider._id}
                          className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-lg">{provider.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{provider.workType}</p>
                            <div className="flex items-center space-x-2">
                              {renderStars(Math.round(provider.averageRating || 0))}
                              <span className="text-sm text-gray-600">
                                {provider.averageRating ? provider.averageRating.toFixed(1) : "0.0"}(
                                {provider.totalReviews || 0} reviews)
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleBookNow(provider._id)}
                            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                          >
                            Book Now
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ServicesPage
