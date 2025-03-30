"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for navigation
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const services = [
  { name: "Electricians", image: "/electrician.jpeg", category: "electrician" },
  { name: "Plumbers", image: "/plumber.jpeg", category: "plumber" },
  { name: "Babysitters", image: "/babysitter.jpeg", category: "babysitter" },
  { name: "Home Cleaners", image: "/cleaner.jpeg", category: "cleaner" },
];

interface Provider {
  id: string;
  name: string;
  workType: string;
  rating: number;
  description: string;
}

function ServicesPage() {
  const router = useRouter(); // Initialize the router
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProviders = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching providers for category:', category); // Debug category
      const token = localStorage.getItem("token");
      console.log('Token:', token); // Debug token
  
      const response = await fetch(
        `http://localhost:5000/api/search?query=${category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Response status:', response.status); // Debug response status
      if (!response.ok) {
        const errorText = await response.text(); // Get error details
      console.error('Error response:', errorText); // Debug error response
      throw new Error("Failed to fetch providers");
      }
  
      const data = await response.json();
      console.log('Fetched providers:', data); // Debug fetched data
      setProviders(data);
      setSelectedCategory(category);
      setIsModalOpen(true); // Open the modal
    } catch (err) {
      console.error('Error fetching providers:', err); // Debug error
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

  const handleBookNow = (providerId: string) => {
    // Navigate to the booking page with the provider's userId
    router.push(`/booking/${providerId}`);
  };

  return (
    <>
      <Navbar />
      {/* Main Content */}
      <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center p-8 md:p-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Our Services
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl">
            Explore our wide range of services and find the perfect provider for your needs.
          </p>
        </section>

        {/* Services Section */}
        <section className="p-8 md:p-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
              >
                {/* Image Container */}
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
                {/* Button Section */}
                <div className="p-4 text-center">
                  <button
                    onClick={() => fetchProviders(service.category)}
                    className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                  >
                    View Providers
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal for Providers */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedCategory
                  ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Providers`
                  : "Providers"}
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
                    key={provider.id} // Add a unique key here
                    className="p-4 border border-gray-200 rounded shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">{provider.name}</h3>
                      <p className="text-sm text-gray-500">{provider.workType}</p>
                      <p className="text-sm text-gray-500">Rating: {provider.rating || "N/A"} ⭐</p>
                      <p className="text-sm text-gray-500">{provider.description || "No description available"}</p>
                    </div>
                    <button
                      onClick={() => handleBookNow(provider.id)} // Navigate to booking page
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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

      <Footer />
    </>
  );
}

export default ServicesPage;