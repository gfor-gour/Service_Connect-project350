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
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [workType, setWorkType] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar toggle

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

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div>
      {/* Mobile menu button */}
      <button
        className="lg:hidden p-4 fixed top-4 left-4 bg-gray-900 text-white rounded-full"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900 text-white py-8 px-4 flex flex-col transition-transform duration-300 lg:left-0 lg:transform-none transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:block`}
      >
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
                href="/search"
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

      {/* Mobile overlay to close sidebar when clicked outside */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 lg:hidden transition-all duration-300 ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={closeSidebar}
      />
    </div>
  );
};

export default Sidebar;
