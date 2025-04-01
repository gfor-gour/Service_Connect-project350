"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  UserCog,
  Users,
  MessageSquare,
  Wrench,
  Bot,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [workType, setWorkType] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (token && userId) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            setUserName(userData.name || "User");
            setUserRole(userData.role || "user");
            setWorkType(userData.workType || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("userRole");
    
    router.push("/");
  };

  const handleDashboardClick = () => {
    if (userRole === "provider") {
      router.push("/provider");
    } else {
      router.push("/user");
    }
  };

  const handleUpdateProfileClick = () => {
    if (userRole === "provider") {
      router.push("/provider-profile");
    } else {
      router.push("/user-profile");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white w-64 py-8 px-4">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold">
            {userName ? userName[0].toUpperCase() : "U"}
          </span>
        </div>
        <h2 className="text-xl font-semibold">{userName}</h2>
        {userRole === "provider" && workType && (
          <p className="text-sm text-gray-400 mt-1 capitalize">{workType}</p>
        )}
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <button
              onClick={handleDashboardClick}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={handleUpdateProfileClick}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <UserCog size={20} />
              <span>Update Profile</span>
            </button>
          </li>
          <li>
            <Link
              href="/find-users"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Users size={20} />
              <span>Find Users</span>
            </Link>
          </li>
          <li>
            <Link
              href="/messenger"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <MessageSquare size={20} />
              <span>Messenger</span>
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Wrench size={20} />
              <span>Services</span>
            </Link>
          </li>
          <li>
            <Link
              href="/chatbot"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Bot size={20} />
              <span>Chatbot</span>
            </Link>
          </li>
        </ul>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors mt-auto"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
