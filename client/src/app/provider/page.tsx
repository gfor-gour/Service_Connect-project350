"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const ProviderPage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePicture: "",
    address: "",
    workType: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setError("Failed to fetch profile");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-extrabold mb-8 text-indigo-600 dark:text-indigo-400 text-center">
            Provider Profile
          </h1>

          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-600 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center border-4 border-indigo-600 shadow-lg">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              {profile.name || "Your Name"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {profile.email || "Your Email"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                {profile.address || "Not Provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Work Type
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-200 capitalize">
                {profile.workType || "Not Specified"}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => (window.location.href = "/provider-profile")}
              className="px-6 py-3 text-lg font-bold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderPage;
