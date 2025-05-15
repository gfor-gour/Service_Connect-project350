"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

const UserProfile = () => {
  const router = useRouter();
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-violet-900">User Profile</h1>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-6">
                {profile.profilePicture ? (
                  <Image
                    src={profile.profilePicture}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="rounded-full object-cover border-4 border-violet-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center border-4 border-violet-500">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-lg font-semibold text-gray-900">{profile.name || "None"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{profile.email || "None"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-700">Address</p>
                  <p className="text-lg font-semibold text-gray-900">{profile.address || "None"}</p>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className="pt-6">
                <button
                  onClick={() => router.push("/user-profile")}
                  className="px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition duration-300"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
