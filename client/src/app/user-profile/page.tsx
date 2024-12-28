"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Profile Picture Section */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <Image
              src={profile.profilePicture || "/default-avatar.png"}
              alt="Profile"
              width={128}
              height={128}
              className="rounded-full object-cover"
            />
            <label htmlFor="profilePicture" className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer">
              <span className="text-xs">Change</span>
            </label>
          </div>
        </div>

        {/* Profile Form */}
        <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-lg font-semibold">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-md shadow-sm bg-gray-700 text-white"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-lg font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                readOnly
                className="w-full p-3 border rounded-md shadow-sm bg-gray-600"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="profilePicture" className="block mb-2 text-lg font-semibold">
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                onChange={handleImageChange}
                className="w-full p-3 border rounded-md bg-gray-700 text-white"
                accept="image/*"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block mb-2 text-lg font-semibold">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-md shadow-sm bg-gray-700 text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
