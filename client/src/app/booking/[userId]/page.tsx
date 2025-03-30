"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

  const params = useParams();
  const userId = params?.userId as string;

  useEffect(() => {
    if (!userId) return;

    const fetchProvider = async () => {
      try {
        console.log('Fetching provider for userId:', userId); // Debug userId
        const token = localStorage.getItem("token");
        console.log('Token:', token); // Debug token
    
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log('Response status:', response.status); // Debug response status
        if (!response.ok) {
          throw new Error("Failed to fetch provider data");
        }
    
        const data = await response.json();
        console.log('Fetched provider:', data); // Debug fetched data
        setProvider(data);
      } catch (err) {
        console.error('Error fetching provider:', err); // Debug error
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [userId]);

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
      <h1 className="text-2xl font-bold mb-4">{provider.name}</h1>
      <p><strong>Service:</strong> {provider.workType}</p>
      <p><strong>Rating:</strong> {provider.rating} ⭐</p>
      <p><strong>Description:</strong> {provider.description}</p>
      <p><strong>Price:</strong> {provider.price}</p>
      <button className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingPage;