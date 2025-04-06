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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-[60] p-3 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 w-64 h-full bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-600 text-white py-8 px-6 flex-col shadow-lg">
        <div className="mb-8 text-center">
          <div className="w-24 h-24 rounded-full bg-white mx-auto mb-4 flex items-center justify-center shadow-md">
            <span className="text-3xl font-bold text-indigo-600">
              {userName ? userName[0].toUpperCase() : "U"}
            </span>
          </div>
          <h2 className="text-xl font-semibold">{userName}</h2>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button
                onClick={handleDashboardClick}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition"
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <Link
                href="/search"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition"
              >
                <Users size={20} />
                <span>Find Users</span>
              </Link>
            </li>
            <li>
              <Link
                href={`/messenger?userId=${localStorage.getItem("userId")}`}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition"
              >
                <MessageSquare size={20} />
                <span>Messenger</span>
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition"
              >
                <Wrench size={20} />
                <span>Services</span>
              </Link>
            </li>
            <li>
              <Link
                href="/chatbot"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition"
              >
                <Bot size={20} />
                <span>Chatbot</span>
              </Link>
            </li>
          </ul>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition mt-auto"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 w-[280px] bg-gray-900 text-white py-8 px-4 transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col pt-12">
          <div className="mb-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold">
                {userName ? userName[0].toUpperCase() : "U"}
              </span>
            </div>
            <h2 className="text-xl font-semibold">{userName}</h2>
            {userRole === "provider" && workType && (
              <p className="text-sm text-gray-400 mt-1 capitalize">
                {workType}
              </p>
            )}
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    handleDashboardClick();
                    closeSidebar();
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleUpdateProfileClick();
                    closeSidebar();
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <UserCog size={20} />
                  <span>Update Profile</span>
                </button>
              </li>
              <li>
                <Link
                  href="/search"
                  onClick={closeSidebar}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Users size={20} />
                  <span>Find Users</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/messenger?userId=${localStorage.getItem("userId")}`}
                  onClick={closeSidebar}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <MessageSquare size={20} />
                  <span>Messenger</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  onClick={closeSidebar}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Wrench size={20} />
                  <span>Services</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chatbot"
                  onClick={closeSidebar}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Bot size={20} />
                  <span>Chatbot</span>
                </Link>
              </li>
            </ul>
          </nav>

          <button
            onClick={() => {
              handleLogout();
              closeSidebar();
            }}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors mt-auto"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
