"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Search  from "../components/Search";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePicture: "",
    address: "",
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
      process.env.NEXT_PUBLIC_IMG_UPLOAD_PRESET || ""
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary Error:", errorData);
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
      } catch (err) {
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
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-6">
          {/* Search Section */}
          <div className="bg-gray-100 shadow-lg p-8 rounded-lg w-full md:w-96 lg:w-[28rem]">
            <h2 className="text-2xl font-bold mb-4">Search Users</h2>
            <Search />
          </div>

          {/* Profile Form */}
          <div className="w-full max-w-lg bg-gray-50 p-6 rounded-lg shadow-md mx-auto">
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <img
                  src={profile.profilePicture || "/default-avatar.png"}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-blue-600"
                />
                <label
                  htmlFor="profilePicture"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full px-2 py-1 text-xs cursor-pointer"
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

              <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-lg font-semibold mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-lg font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-200"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="block text-lg font-semibold mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update Profile
                </button>
                <Link href="/messenger" className="block w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center">
                  Go to Messenger
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;

