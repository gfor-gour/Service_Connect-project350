"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Provider {
  name: string;
  workType: string;
  rating: number;
  description: string;
  price: string;
}

const BookingPage = () => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { userId } = router.query; // Get userId from the dynamic route

  useEffect(() => {
    if (!userId) return;

    const fetchProvider = async () => {
      try {
        // Fetch provider details from the backend
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch provider data");
        }
        const data = await response.json();
        setProvider(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [userId]);

  const handleBooking = async () => {
    try {
      // Example booking logic (replace with actual implementation)
      const response = await fetch(`/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId: userId,
          clientId: "currentUserId", // Replace with the actual logged-in user's ID
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to book the provider");
      }

      alert("Booking successful!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      alert(`Booking failed: ${errorMessage}`);
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold">{error}</div>;
  }

  if (!provider) {
    return <div className="text-center text-lg font-semibold">Provider not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{provider.name}</h1>
        <p className="text-gray-600">
          <strong>Service:</strong> {provider.workType}
        </p>
        <p className="text-gray-600">
          <strong>Rating:</strong> {provider.rating || "N/A"} ⭐
        </p>
        <p className="text-gray-600">
          <strong>Description:</strong> {provider.description || "No description available"}
        </p>
        <p className="text-gray-600">
          <strong>Price:</strong> {provider.price || "Contact for pricing"}
        </p>
      </div>
      <div className="text-center">
        <button
          onClick={handleBooking}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default BookingPage;