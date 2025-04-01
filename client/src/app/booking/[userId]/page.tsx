"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Sidebar from "../../components/Sidebar";

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
  paymentStatus: string;
}

export default function BookingPage() {
  const { userId } = useParams();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [description, setDescription] = useState("");
  const [bookingStatus, setBookingStatus] = useState<string>("Pending");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null); // To store user details (name, address, etc.)

  useEffect(() => {
    fetchProviderDetails();
    fetchBookingHistory();
    fetchUserDetails();
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

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentUserId = localStorage.getItem("userId");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/${currentUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch user details");
      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/bookings/book`,
        {
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
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to send booking request");

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

  const handlePayment = async (booking: Booking) => {
    try {
      if (booking.paymentStatus === "success") {
        alert("Payment already successful for this booking.");
        return;
      }

      const token = localStorage.getItem("token");
      const currentUserId = localStorage.getItem("userId");

      // Initialize payment by calling the payment gateway API
      const paymentData = {
        userId: currentUserId,
        price: booking.price,
        address: userDetails?.address, // User address from user history
        name: userDetails?.name, // User name from user history
        bookingId: booking._id,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/transactions/sslcommerz/init`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(paymentData),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to initiate payment");

      // Check if the response contains a redirect URL
      if (data.url) {
        // Redirect the user to the payment gateway
        window.location.href = data.url;
      } else {
        alert("Payment initiation failed. No redirect URL received.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment!");
    }
  };

  const handleCashOnDelivery = (booking: Booking) => {
    alert(`Cash on Delivery selected for Booking ID: ${booking._id}`);
    // Implement COD logic, update status if needed
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full max-w-4xl mx-auto p-6 bg-white">
        {provider ? (
          <div>
            <h2 className="text-3xl font-bold text-violet-700 mb-6">
              Book Provider
            </h2>
            <div className="flex items-center mb-8">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-6">
                {provider.profilePicture ? (
                  <img
                    src={provider.profilePicture}
                    alt={provider.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-violet-600 text-3xl font-bold">
                    {provider.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {provider.name}
                </h3>
                <p className="text-gray-600">{provider.email}</p>
                {provider.workType && (
                  <p className="text-sm text-violet-600">{provider.workType}</p>
                )}
              </div>
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-3 rounded-md mb-6"
              placeholder="Enter booking details..."
            />

            <button
              onClick={handleBookingRequest}
              disabled={bookingStatus === "Booked" || isProcessing}
              className="bg-violet-600 text-white px-6 py-3 rounded-lg w-full"
            >
              {isProcessing
                ? "Processing..."
                : bookingStatus === "Booked"
                ? "Already Booked"
                : "Book Now"}
            </button>

            {/* Booking History */}
            {bookingHistory.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-violet-700 mb-4">
                  Booking History
                </h2>
                {bookingHistory.map((booking) => (
                  <div
                    key={booking._id}
                    className="border p-6 mb-4 rounded-lg bg-violet-50 shadow-lg"
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
                    <p className="text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Payment Status: {booking.paymentStatus}
                    </p>

                    {/* Show Payment Options if Status is Accepted and Payment not successful */}
                    {booking.status === "accepted" &&
                      booking.paymentStatus !== "success" &&
                      booking.price && (
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={() => handleCashOnDelivery(booking)}
                            className="bg-gray-700 text-white px-4 py-2 rounded-md"
                          >
                            Cash on Delivery
                          </button>
                          <button
                            onClick={() => handlePayment(booking)}
                            disabled={booking.paymentStatus === "success"}
                            className="bg-violet-500 text-white px-4 py-2 rounded-md hover:bg-violet-600"
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
    </div>
  );
}
