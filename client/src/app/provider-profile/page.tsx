"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

const ProviderProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePicture: "",
    address: "",
    workType: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

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
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = profile.profilePicture;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const token = localStorage.getItem("token");
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
        setProfile(updatedProfile);
        alert("Profile updated successfully");
      } else {
        setError("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-800"></div>
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
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h1 className="text-4xl font-extrabold mb-8 text-gray-800 text-center">
            Provider Dashboard
          </h1>
  
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6">
              <img
                src={profile.profilePicture || "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-800 shadow-lg"
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-800 text-gray-800 focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-800 text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-800 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-800 text-gray-800 focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="workType" className="block text-sm font-medium text-gray-800 mb-2">
                  Work Type
                </label>
                <select
                  id="workType"
                  name="workType"
                  value={profile.workType}
                  onChange={(e) => setProfile({ ...profile, workType: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-800 text-gray-800 focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                >
                  <option value="" disabled>Select work type</option>
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
                className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:bg-gray-600 focus:ring-offset-2 transition"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};  

export default ProviderProfile;
