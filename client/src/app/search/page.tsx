'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MapComponent from '../components/MapComponent';
import Sidebar from '../components/Sidebar';

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
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  const searchUsers = async (searchQuery: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/search?query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      searchUsers(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleUserClick = (user: User) => {
      setSelectedUser(user);
    };
  
  // Removed unused onSelectUser function (no further action needed as it's already removed)

  const handleMessageClick = (userId: string) => {
    router.push(`/messenger/${userId}`);
  };

  const handleBookClick = (userId: string) => {
    router.push(`/booking/${userId}`);
  };

  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar />
      <div className="flex-1 p-6 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold text-violet-500 mb-6 text-center">Search Users</h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name, email, or work type..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md p-3 border border-violet-500 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 mb-6"
        />

        {/* Search Results */}
        <div className="space-y-4 w-full max-w-md">
          {results.map((user) => (
            <div
              key={user._id}
              className={`p-5 border border-gray-300 rounded-lg shadow-md flex flex-col items-center justify-between cursor-pointer transition-all duration-300 hover:bg-gray-100 ${
                selectedUser?._id === user._id ? 'bg-gray-200' : ''
              }`}
              onClick={() => handleUserClick(user)}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-4">
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-violet-500 text-lg font-semibold">
                      {user.name ? user.name.charAt(0) : '?'}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-black">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.role === 'provider' && (
                    <p className="text-sm text-violet-500">{user.workType}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-3 w-full">
                <button
                  onClick={() => handleMessageClick(user._id)}
                  className="px-4 py-2 text-sm bg-violet-500 text-white rounded-lg hover:bg-violet-600 w-full"
                >
                  Message
                </button>
                <button
                  onClick={() => handleBookClick(user._id)}
                  disabled={user.role !== 'provider'}
                  className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 border w-full ${
                    user.role === 'provider'
                      ? 'border-violet-500 text-black bg-white hover:bg-gray-100'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Map Component */}
        {selectedUser && (
          <div className="mt-6 bg-gray-100 p-5 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-violet-500 mb-3">Location of {selectedUser.name}</h3>
            <MapComponent address={selectedUser.address} />
          </div>
        )}
      </div>
    </div>
  );
}
