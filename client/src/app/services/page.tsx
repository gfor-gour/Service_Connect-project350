"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  rating: number;
  description: string;
}

function ServicesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProviders = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
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
      setProviders(data);
      setSelectedCategory(category);
      setIsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProviders([]);
    setSelectedCategory(null);
  };

  const handleBookNow = (userId: string) => {
    router.push(`/booking/${userId}`);
  };

  return (
    <div className="flex bg-white dark:bg-black min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 lg:ml-64 text-black dark:text-white">
        <h1 className="text-4xl font-bold text-violet-700 mb-6">Our Services</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Explore our wide range of services and find the perfect provider for your needs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-violet-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md"
            >
              <div className="relative group">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-64 object-cover opacity-80 group-hover:opacity-100 transition"
                />
                <div className="absolute inset-0 bg-black/50 dark:bg-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <h3 className="text-xl font-bold text-white dark:text-black">
                    {service.name}
                  </h3>
                </div>
              </div>
              <div className="p-4 text-center">
                <button
                  onClick={() => fetchProviders(service.category)}
                  className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition"
                >
                  View Providers
                </button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-violet-700">
                  {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Providers` : "Providers"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : (
                <div className="space-y-4">
                  {providers.map((provider) => (
                    <div
                      key={provider._id}
                      className="p-4 border border-gray-200 rounded shadow-sm flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold text-black dark:text-white">{provider.name}</h3>
                        <p className="text-sm text-gray-500">{provider.workType}</p>
                        <p className="text-sm text-gray-500">Rating: {provider.rating || "N/A"} ⭐</p>
                        <p className="text-sm text-gray-500">{provider.description || "No description available"}</p>
                      </div>
                      <button
                        onClick={() => handleBookNow(provider._id)}
                        className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ServicesPage;
