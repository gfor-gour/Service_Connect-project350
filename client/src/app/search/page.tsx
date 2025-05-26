"use client";

import type React from "react";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "../components/Sidebar";

// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(() => import("../components/map-component"), {
  ssr: false,
});

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  workType?: string;
  profilePicture?: string;
  address: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const searchUsers = async (searchQuery: string) => {
      setSearchLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_APP_BACKEND_URL
          }/api/search?query=${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    if (debouncedQuery) {
      searchUsers(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleMessageClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    router.push(`/messenger/${userId}`);
  };

  const handleBookClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    router.push(`/booking/${userId}`);
  };

  const handleReviewClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    router.push(`/reviews/${userId}`);
  };

  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar />
  
      <div className="flex-1 p-6 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Search Users
        </h1>
  
        <div className="relative w-full max-w-md mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or work type..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 border border-gray-800 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
          {searchLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800"></div>
            </div>
          )}
        </div>
  
        <div className="space-y-4 w-full max-w-md">
          {results.map((user) => (
            <div
              key={user._id}
              className={`p-5 border border-gray-300 rounded-lg shadow-md flex flex-col items-center justify-between cursor-pointer transition-all duration-300 hover:bg-gray-100 ${
                selectedUser?._id === user._id ? "bg-gray-200" : ""
              }`}
              onClick={() => handleUserClick(user)}
            >
              <div className="flex items-center mb-4 w-full">
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-4 flex-shrink-0">
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture || "/placeholder.svg"}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-gray-800 text-lg font-semibold">
                      {user.name ? user.name.charAt(0) : "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-black">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.role === "provider" && (
                    <p className="text-sm text-gray-800">{user.workType}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 w-full">
                <button
                  onClick={(e) => handleMessageClick(e, user._id)}
                  className="px-3 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex-1 transition-colors"
                >
                  Message
                </button>
                <button
                  onClick={(e) => handleBookClick(e, user._id)}
                  disabled={user.role !== "provider"}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-300 border flex-1 ${
                    user.role === "provider"
                      ? "border-gray-800 text-black bg-white hover:bg-gray-100"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Book
                </button>
                <button
                  onClick={(e) => handleReviewClick(e, user._id)}
                  disabled={user.role !== "provider"}
                  className={`px-3 py-2 text-sm rounded-lg flex-1 transition-all duration-300 ${
                    user.role === "provider"
                      ? "bg-gray-800 text-white hover:bg-gray-900"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Reviews
                </button>
              </div>
            </div>
          ))}
        </div>
  
        {results.length === 0 && debouncedQuery && !searchLoading && (
          <div className="text-center text-gray-500 mt-8">
            <p>No users found for &quot;{debouncedQuery}&quot;</p>
          </div>
        )}
  
        {selectedUser && (
          <div className="mt-6 bg-gray-100 p-5 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Location of {selectedUser.name}
            </h3>
            <MapComponent address={selectedUser.address} />
          </div>
        )}
      </div>
    </div>
  );
  
}
