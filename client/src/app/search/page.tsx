"use client";

import type React from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SearchIcon } from "lucide-react";
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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

  const handleUserClick = (user: User) => setSelectedUser(user);
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

  const handleSearchClick = () => {
    if (query.trim()) {
      // Trigger search immediately by updating results
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
      searchUsers(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar onToggle={setIsSidebarCollapsed} />

      <div
        className={`flex-1 min-h-screen transition-all duration-300 ease-in-out px-4 md:px-0 md:pt-14 ${
          isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        <div className="py-4 md:p-8 w-full max-w-none h-full">
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Left Side - Search */}
            <div className="flex-1 lg:w-1/2 space-y-6">
              <div className="relative w-full mb-6">
                <input
                  type="text"
                  placeholder="Search by name, email, or work type..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full p-3 pr-12 border border-gray-800 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
                <button
                  onClick={handleSearchClick}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={searchLoading}
                >
                  {searchLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800"></div>
                  ) : (
                    <SearchIcon size={20} />
                  )}
                </button>
              </div>

              <div className="space-y-4 w-full max-h-[400px] lg:max-h-[calc(100vh-200px)] overflow-y-auto">
                {results.map((user) => (
                  <div
                    key={user._id}
                    className={`p-5 border border-gray-300 rounded-lg shadow-md flex flex-col items-center justify-between cursor-pointer transition-all duration-300 hover:bg-gray-100 w-full ${
                      selectedUser?._id === user._id
                        ? "bg-gray-200 border-gray-800"
                        : ""
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
                          <p className="text-sm text-gray-800">
                            {user.workType}
                          </p>
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
            </div>

            {/* Right Side - Map */}
            <div className="flex-1 lg:w-1/2">
              <div className="bg-gray-100 p-5 rounded-lg shadow-lg h-full min-h-[400px] lg:min-h-[calc(100vh-200px)]">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {selectedUser
                    ? `Location of ${selectedUser.name}`
                    : "Select a profile to see location"}
                </h3>
                {selectedUser ? (
                  <MapComponent address={selectedUser.address} />
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[300px] text-gray-500">
                    <p className="text-center">
                      Tap on a profile from the search results to see their
                      location on the map
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
