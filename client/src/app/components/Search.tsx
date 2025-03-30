'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/navigation';
import MapComponent from './MapComponent';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  workType?: string;
  profilePicture?: string;
  address: string;
}

interface SearchProps {
  onSelectUser?: (userId: string) => void;
}

export default function Search({ onSelectUser }: SearchProps) {
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

  const handleMessageClick = (userId: string) => {
    router.push(`/messenger/${userId}`);
  };

  const handleBookClick = (userId: string) => {
    router.push(`/booking/${userId}`);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name, email, or work type..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Search Results */}
      <div className="space-y-2">
        {results.map((user) => (
          <div
            key={user._id}
            className={`p-4 border border-gray-200 rounded shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
              selectedUser?._id === user._id ? 'bg-gray-100' : ''
            }`}
            onClick={() => handleUserClick(user)}
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-4">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-lg font-semibold">
                    {user.name ? user.name.charAt(0) : '?'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                {user.role === 'provider' && (
                  <p className="text-sm text-blue-500">{user.workType}</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleMessageClick(user._id)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Message
              </button>
              <button
                onClick={() => handleBookClick(user._id)}
                disabled={user.role !== 'provider'}
                className={`px-3 py-1 text-sm rounded ${
                  user.role === 'provider'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Map Component (Shows only if a user is selected) */}
      {selectedUser && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Location of {selectedUser.name}</h3>
          <MapComponent address={selectedUser.address} />
        </div>
      )}
    </div>
  );
}
