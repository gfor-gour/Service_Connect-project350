"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Provider {
  _id: string;
  name: string;
  email: string;
  workType?: string;
  profilePicture?: string;
  address: string;
}

interface Booking {
  _id: string;
  providerId: Provider;
  description: string;
  status: string;
  price?: number;
  createdAt: string;
}

export default function BookingPage() {
  const { userId } = useParams(); 
  const [provider, setProvider] = useState<Provider | null>(null);
  const [description, setDescription] = useState("");
  const [bookingStatus, setBookingStatus] = useState<string>("Pending");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);

  useEffect(() => {
    fetchProviderDetails();
    fetchBookingHistory();
  }, []);

  const fetchProviderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch provider details");
      const data = await response.json();
      setProvider(data);
    } catch (error) {
      console.error("Error fetching provider details:", error);
    }
  };

  const fetchBookingHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentUserId = localStorage.getItem("userId");

      if (!currentUserId) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/bookings/user/${currentUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch booking history");

      const data = await response.json();
      setBookingHistory(data);
    } catch (error) {
      console.error("Error fetching booking history:", error);
    }
  };

  const handleBookingRequest = async () => {
    try {
      if (isProcessing) return;
      const token = localStorage.getItem("token");
      const currentUserId = localStorage.getItem("userId");

      if (!provider || !currentUserId || !description.trim()) {
        alert("Please provide all details before booking!");
        return;
      }

      setIsProcessing(true);

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
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send booking request");

      alert("Booking request sent successfully!");
      setBookingHistory((prev) => [...prev, data.booking]); // Update booking history
      setBookingStatus("Booked");
      setBookingId(data.booking._id);
    } catch (error) {
      console.error("Error sending booking request:", error);
      alert("Failed to send booking request!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = (booking: Booking) => {
    alert(`Proceeding to pay ${booking.price} BDT for Booking ID: ${booking._id}`);
    // Implement Payment Gateway logic here (SSLCommerz, Stripe, etc.)
  };

  const handleCashOnDelivery = (booking: Booking) => {
    alert(`Cash on Delivery selected for Booking ID: ${booking._id}`);
    // Implement COD logic, update status if needed
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      {provider ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Book Provider</h2>
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-4">
              {provider.profilePicture ? (
                <img src={provider.profilePicture} alt={provider.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-gray-500 text-2xl font-semibold">{provider.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-xl">{provider.name}</h3>
              <p className="text-gray-600">{provider.email}</p>
              {provider.workType && <p className="text-sm text-blue-500">{provider.workType}</p>}
            </div>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            placeholder="Enter booking details..."
          />

          <button
            onClick={handleBookingRequest}
            disabled={bookingStatus === "Booked" || isProcessing}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            {isProcessing ? "Processing..." : bookingStatus === "Booked" ? "Already Booked" : "Book Now"}
          </button>

          {/* Booking History */}
          {bookingHistory.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Booking History</h2>
              {bookingHistory.map((booking) => (
                <div key={booking._id} className="border p-3 mb-2 rounded bg-gray-50">
                  <p><strong>Provider:</strong> {booking.providerId.name}</p>
                  <p><strong>Status:</strong> {booking.status}</p>
                  <p><strong>Description:</strong> {booking.description}</p>
                  {booking.price && <p><strong>Price:</strong> {booking.price} BDT</p>}
                  <p className="text-sm text-gray-500">{new Date(booking.createdAt).toLocaleString()}</p>

                  {/* Show Payment Options if Status is Accepted */}
                  {booking.status === "accepted" && booking.price && (
                    <div className="mt-2 flex space-x-3">
                      <button
                        onClick={() => handleCashOnDelivery(booking)}
                        className="bg-gray-600 text-white px-3 py-1 rounded"
                      >
                        Cash on Delivery
                      </button>
                      <button
                        onClick={() => handlePayment(booking)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Pay {booking.price} BDT
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>Loading provider information...</p>
      )}
    </div>
  );
}
