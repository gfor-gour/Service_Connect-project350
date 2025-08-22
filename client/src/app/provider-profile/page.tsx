"use client";

import type React from "react";

export const dynamic = "force-dynamic";

import { useState, useEffect, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

interface ProfileData {
  name: string;
  email: string;
  profilePicture: string;
  address: string;
  workType: string;
}

const ProviderProfile = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    profilePicture: "",
    address: "",
    workType: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_IMG_UPLOAD_PRESET as string
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Ensure all required fields exist with proper fallbacks
          const safeProfile: ProfileData = {
            name: data?.name || "",
            email: data?.email || "",
            profilePicture: data?.profilePicture || "",
            address: data?.address || "",
            workType: data?.workType || "",
          };

          setProfile(safeProfile);
          setError(""); // Clear any previous errors
        } else {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.message || "Failed to fetch profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("An unexpected error occurred while fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError("");

    try {
      let imageUrl = profile.profilePicture;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...profile, profilePicture: imageUrl }),
        }
      );

      if (response.ok) {
        const updatedProfile = await response.json();

        // Safely update profile with fallbacks
        const safeUpdatedProfile: ProfileData = {
          name: updatedProfile?.name || profile.name,
          email: updatedProfile?.email || profile.email,
          profilePicture: updatedProfile?.profilePicture || imageUrl,
          address: updatedProfile?.address || profile.address,
          workType: updatedProfile?.workType || profile.workType,
        };

        setProfile(safeUpdatedProfile);
        setImageFile(null); // Clear the image file after successful upload
        alert("Profile updated successfully");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("An unexpected error occurred while updating profile");
    } finally {
      setUpdating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar onToggle={setIsSidebarCollapsed} />
        <div
          className={`flex-1 flex items-center justify-center transition-all duration-300 px-4 md:pt-14 ${
            isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-800"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profile.email) {
    return (
      <div className="flex min-h-screen">
        <Sidebar onToggle={setIsSidebarCollapsed} />
        <div
          className={`flex-1 flex items-center justify-center transition-all duration-300 px-4 md:pt-14 ${
            isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
          }`}
        >
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-6">
                  <img
                    src={profile.profilePicture || "/default-avatar.png"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-800 shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/default-avatar.png";
                    }}
                  />
                  <label
                    htmlFor="profilePicture"
                    className="absolute bottom-0 right-0 bg-gray-800 text-white rounded-full px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 transition"
                  >
                    Change
                  </label>
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-800 mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name || ""}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-800 text-gray-800 focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-800 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email || ""}
                      readOnly
                      className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-800 text-gray-800"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-800 mb-2"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={profile.address || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-800 text-gray-800 focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="workType"
                      className="block text-sm font-medium text-gray-800 mb-2"
                    >
                      Work Type
                    </label>
                    <select
                      id="workType"
                      name="workType"
                      value={profile.workType || ""}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          workType: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-800 text-gray-800 focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    >
                      <option value="" disabled>
                        Select work type
                      </option>
                      <option value="plumber">Plumber</option>
                      <option value="electrician">Electrician</option>
                      <option value="babysitter">Babysitter</option>
                      <option value="cleaner">Cleaner</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:bg-gray-600 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
