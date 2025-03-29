'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  workType?: string;
  profilePicture?: string;
  address: string;
}

export default function BookingPage() {
  const router = useRouter();
  const { userId } = useParams(); // Get the userId from the URL
  const [user, setUser] = useState<User | null>(null);
  const [isBooking, setIsBooking] = useState(false); // Track whether the user is booking
  const [description, setDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [bookingStatus, setBookingStatus] = useState<string>('pending'); // Track booking status
  const loggedInUserId = localStorage.getItem('userId'); 
  console.log('Logged In User ID:', loggedInUserId);
  useEffect(() => {
    if (userId) {
      // Fetch the provider's details and booking status
      fetchUserDetails(userId as string);
    }
  }, [userId]);

  const fetchUserDetails = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch user details');
      const data = await response.json();
      setUser(data);
      console.log('User ID:', data._id);
      console.log('User Details:', data);
      // Fetch the current booking status
      fetchBookingStatus(userId);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchBookingStatus = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/booking/status/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch booking status');
      const data = await response.json();
      setBookingStatus(data.status); // The status can be 'pending', 'accepted', or 'rejected'
    } catch (error) {
      console.error('Error fetching booking status:', error);
    }
  };

  const handleBooking = async () => {
    setIsBooking(true);
    setStatusMessage('Booking request is being processed...');
    // Send booking request to the backend with description
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/booking/request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            providerId: user?._id,
            description,
          }),
        }
      );
      if (!response.ok) throw new Error('Booking request failed');
      // Handle response from booking API (e.g., success message or redirection)
      setStatusMessage('Booking request sent successfully! Please wait for confirmation.');
    } catch (error) {
      console.error('Booking error:', error);
      setStatusMessage('Failed to send booking request. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      {user ? (
        <div>
          {/* Display provider information */}
          <h2 className="text-2xl font-semibold mb-4">Booking Appointment with {user.name}</h2>
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-4">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-2xl font-semibold">
                  {user.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-xl">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              {user.workType && <p className="text-sm text-blue-500">{user.workType}</p>}
            </div>
          </div>

          {/* Booking Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg">Description:</h3>
            <textarea
              className="w-full p-2 mt-2 border border-gray-300 rounded"
              placeholder="Describe your booking request"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="mb-4 text-sm text-gray-700">
              <p>{statusMessage}</p>
            </div>
          )}

          {/* Booking Status */}
          <div className="mt-6">
            {bookingStatus === 'pending' && (
              <p className="text-yellow-600">Your booking request is pending approval.</p>
            )}
            {bookingStatus === 'accepted' && (
              <div>
                <p className="text-green-600">Provider has accepted your booking!</p>
                <div className="flex space-x-4 mt-4">
                  <button
                    className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => alert('Proceeding with payment')}
                  >
                    Pay Now
                  </button>
                  <button
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => alert('Cash on delivery option selected')}
                  >
                    Cash on Delivery
                  </button>
                </div>
              </div>
            )}
            {bookingStatus === 'rejected' && (
              <p className="text-red-600">Provider has rejected your booking.</p>
            )}
          </div>

          {/* Booking Options */}
          {isBooking ? (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h4 className="text-xl font-semibold">Booking in Progress</h4>
              <div className="flex space-x-4 mt-4">
                <button
                  className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => alert('Proceeding with payment')}
                >
                  Pay Now
                </button>
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => alert('Cash on delivery option selected')}
                >
                  Cash on Delivery
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleBooking}
              >
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading provider information...</p>
      )}
    </div>
  );
}
