"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MessageCircle, Wrench, Bot } from "lucide-react";
import Sidebar from "../components/Sidebar";

const UserProfile = () => {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePicture: "",
    address: "",
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
      } catch {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const featureCards = [
    {
      title: "Find User",
      icon: Search,
      description: "Search and connect with service providers",
      action: () => router.push("/search"),
    },
    {
      title: "Messenger",
      icon: MessageCircle,
      description: "Chat with your service providers",
      action: () =>
        router.push("/messenger?userId=" + localStorage.getItem("userId")),
    },
    {
      title: "Services",
      icon: Wrench,
      description: "Browse available services",
      action: () => router.push("/services"),
    },
    {
      title: "AI Assistant",
      icon: Bot,
      description: "Get help from our AI assistant",
      action: () => router.push("/chatbot"),
    },
  ];

  if (loading)
    return (
      <div className="flex min-h-screen">
        <Sidebar onToggle={setIsSidebarCollapsed} />
        <div
          className={`flex-1 flex items-center justify-center transition-all duration-300 px-4 md:pt-14 ${
            isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
          }`}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-800"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen">
        <Sidebar onToggle={setIsSidebarCollapsed} />
        <div
          className={`flex-1 flex items-center justify-center text-red-500 transition-all duration-300 px-4 md:pt-14 ${
            isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
          }`}
        >
          {error}
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar onToggle={setIsSidebarCollapsed} />
      <div
        className={`flex-1 min-h-screen transition-all duration-300 ease-in-out px-4 md:px-0 md:pt-14 ${
          isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        <div className="py-4 md:p-8 w-full max-w-none">
          <div className="w-full space-y-6 md:space-y-8">
            {/* Profile Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col items-center mb-6 md:mb-8">
                <div className="relative mb-4 md:mb-6">
                  {profile.profilePicture ? (
                    <Image
                      src={profile.profilePicture || "/placeholder.svg"}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="rounded-full object-cover border-4 border-gray-800 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-800 shadow-lg">
                      <span className="text-2xl md:text-4xl font-bold text-gray-800">
                        {profile.name ? profile.name[0].toUpperCase() : "U"}
                      </span>
                    </div>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center">
                  {profile.name || "User"}
                </h2>
                <p className="text-gray-600 mb-4 text-center">
                  {profile.email || "Not provided"}
                </p>

                {/* Address */}
                <div className="w-full max-w-2xl">
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Address
                    </p>
                    <p className="text-lg md:text-xl font-semibold text-gray-800">
                      {profile.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6 md:mt-8">
                <button
                  onClick={() => router.push("/user-profile")}
                  className="px-6 md:px-8 py-3 text-base md:text-lg font-bold text-white bg-gray-800 rounded-xl shadow-md hover:bg-gray-700 transition duration-200 w-full sm:w-auto"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col items-start space-y-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <card.icon className="w-6 h-6 text-gray-800" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {card.description}
                      </p>
                    </div>
                    <button
                      onClick={card.action}
                      className="w-full px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      Go to {card.title.toLowerCase()}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
