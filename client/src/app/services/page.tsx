"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import Sidebar from "../components/Sidebar";

const services = [
  { name: "Electricians", image: "/electrician.jpeg", category: "electrician" },
  { name: "Plumbers", image: "/plumber.jpeg", category: "plumber" },
  { name: "Babysitters", image: "/babysitter.jpeg", category: "babysitter" },
  { name: "Home Cleaners", image: "/cleaner.jpeg", category: "cleaner" },
];

interface Provider {
  _id: string;
  name: string;
  workType: string;
  rating?: number;
  averageRating?: number;
  totalReviews?: number;
}

function ServicesPage() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const fetchProviders = async (category: string) => {
    setLoading(true);
    setError(null);

    try {
      let token: string | null = null;

      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/search?query=${category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch providers");
      }

      const data = await response.json();

      const providersWithRatings = await Promise.all(
        data.map(async (provider: Provider) => {
          try {
            const reviewsResponse = await fetch(
              `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/reviews/provider/${provider._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (reviewsResponse.ok) {
              const reviewsData = await reviewsResponse.json();
              return {
                ...provider,
                averageRating: reviewsData.averageRating || 0,
                totalReviews: reviewsData.totalReviews || 0,
              };
            }
            return { ...provider, averageRating: 0, totalReviews: 0 };
          } catch (error) {
            console.error(
              `Error fetching reviews for provider ${provider._id}:`,
              error
            );
            return { ...provider, averageRating: 0, totalReviews: 0 };
          }
        })
      );

      setProviders(providersWithRatings);
      setSelectedCategory(category);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (userId: string) => {
    router.push(`/booking/${userId}`);
  };

  const clearSelection = () => {
    setSelectedCategory(null);
    setProviders([]);
    setError(null);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar onToggle={setIsSidebarCollapsed} />

      <main
        className={`flex-1 transition-all duration-300 ease-in-out px-4 md:px-0 md:pt-14 ${
          isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        <div className="w-full max-w-none h-full">
          <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-56px)] md:h-[calc(100vh-56px)]">
            {/* Left Side - Services Grid */}
            <div className="flex-1 lg:flex-[2] overflow-y-auto p-4 md:p-8">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Our Services
                </h1>
                <p className="text-lg text-gray-600">
                  Explore our wide range of services and find the perfect
                  provider for your needs.
                </p>
              </div>

              {/* Bigger cards - only 2 per row with more gap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 place-items-center">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-xl overflow-hidden shadow-lg border-2 max-w-md w-full transition-all duration-300 cursor-pointer
          ${
            selectedCategory === service.category
              ? "border-gray-800 shadow-xl scale-105"
              : "border-gray-200 hover:border-gray-400 hover:shadow-xl"
          }`}
                    onClick={() => fetchProviders(service.category)}
                  >
                    <div className="relative group">
                      <img
                        src={
                          service.image ||
                          "/placeholder.svg?height=220&width=320"
                        }
                        alt={service.name}
                        className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-2xl font-bold text-white">
                          {service.name}
                        </h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <button className="w-full px-5 py-3 bg-gray-800 text-white text-lg font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                        View {service.name}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Providers List */}
            <div className="flex-1 lg:flex-[1] flex flex-col min-h-0 p-4 md:p-8 md:pl-0">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-full">
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedCategory
                        ? `${
                            selectedCategory.charAt(0).toUpperCase() +
                            selectedCategory.slice(1)
                          } Providers`
                        : "Select a Service"}
                    </h2>
                    {selectedCategory && (
                      <button
                        onClick={clearSelection}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {!selectedCategory ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Star className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg">
                        Choose a service category to view available providers
                      </p>
                    </div>
                  ) : loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                      <span className="ml-3 text-gray-600">
                        Loading providers...
                      </span>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <p className="text-red-600 mb-4">{error}</p>
                      <button
                        onClick={() => fetchProviders(selectedCategory)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {providers.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500 text-lg">
                            No providers found for this category.
                          </p>
                        </div>
                      ) : (
                        providers.map((provider) => (
                          <div
                            key={provider._id}
                            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gray-50"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-800 text-lg">
                                  {provider.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {provider.workType}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {renderStars(
                                  Math.round(provider.averageRating || 0)
                                )}
                                <span className="text-sm text-gray-600">
                                  {provider.averageRating
                                    ? provider.averageRating.toFixed(1)
                                    : "0.0"}
                                  ({provider.totalReviews || 0} reviews)
                                </span>
                              </div>

                              <button
                                onClick={() => handleBookNow(provider._id)}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ServicesPage;
