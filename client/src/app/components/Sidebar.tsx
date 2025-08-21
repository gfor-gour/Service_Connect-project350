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
  X,
  Columns2,
} from "lucide-react";

const Sidebar = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [workType, setWorkType] = useState("");
  const [userId, setUserId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true); // minimized by default

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");

      if (token && storedUserId) {
        setUserId(storedUserId);

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/${storedUserId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
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
    router.push(userRole === "provider" ? "/provider" : "/user");
  };

  const handleUpdateProfileClick = () => {
    router.push(
      userRole === "provider" ? "/provider-profile" : "/user-profile"
    );
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex fixed left-0 top-0 h-full bg-white text-black py-8 px-3 flex-col shadow-lg transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Profile */}
        <div
          className="mb-8 text-center cursor-pointer relative"
          onClick={() => setCollapsed(!collapsed)}
        >
          <div
            className={`rounded-full bg-black text-white mx-auto mb-2 flex items-center justify-center transition-all duration-300 ${
              collapsed ? "w-12 h-12" : "w-14 h-14"
            }`}
          >
            <span
              className={`text-lg font-bold transition-all duration-300 ${
                collapsed ? "text-xl" : "text-lg"
              }`}
            >
              {userName ? userName[0].toUpperCase() : "U"}
            </span>
          </div>
          {!collapsed && <h2 className="text-sm font-semibold">{userName}</h2>}

          {/* ChatGPT-style close button */}
          {/* Columns2 collapse button */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="absolute -top-4 right-0 p-2 bg-gray-200 rounded-full shadow hover:bg-gray-300 transition"
            >
              <Columns2 size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button
                onClick={handleDashboardClick}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-black transition text-sm"
              >
                <LayoutDashboard size={24} />
                {!collapsed && <span>Dashboard</span>}
              </button>
            </li>
            <li>
              <Link
                href="/search"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-black transition text-sm"
              >
                <Users size={24} />
                {!collapsed && <span>Find Users</span>}
              </Link>
            </li>
            {userId && (
              <li>
                <Link
                  href={`/messenger?userId=${userId}`}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-black transition text-sm"
                >
                  <MessageSquare size={24} />
                  {!collapsed && <span>Messenger</span>}
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/services"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-black transition text-sm"
              >
                <Wrench size={24} />
                {!collapsed && <span>Services</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/chatbot"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-black transition text-sm"
              >
                <Bot size={24} />
                {!collapsed && <span>AI Assistant</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 transition mt-auto text-sm"
        >
          <LogOut size={24} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Mobile sidebar */}
      <button
        className="lg:hidden fixed top-4 right-4 z-[60] p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={28} /> : <X size={28} />}
      </button>

      <div
        className={`lg:hidden fixed inset-y-0 right-0 w-[280px] bg-white text-black py-8 px-6 transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col pt-12">
          <div className="mb-8 text-center">
            <div className="w-20 h-20 rounded-full bg-black text-white mx-auto mb-4 flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold">
                {userName ? userName[0].toUpperCase() : "U"}
              </span>
            </div>
            <h2 className="text-xl font-semibold">{userName}</h2>
            {userRole === "provider" && workType && (
              <p className="text-sm text-gray-600 mt-1 capitalize">
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
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-black transition text-sm"
                >
                  <LayoutDashboard size={24} />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleUpdateProfileClick();
                    closeSidebar();
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-black transition text-sm"
                >
                  <UserCog size={24} />
                  <span>Update Profile</span>
                </button>
              </li>
              <li>
                <Link
                  href="/search"
                  onClick={closeSidebar}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-black transition text-sm"
                >
                  <Users size={24} />
                  <span>Find Users</span>
                </Link>
              </li>
              {userId && (
                <li>
                  <Link
                    href={`/messenger?userId=${userId}`}
                    onClick={closeSidebar}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-black transition text-sm"
                  >
                    <MessageSquare size={24} />
                    <span>Messenger</span>
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/services"
                  onClick={closeSidebar}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-black transition text-sm"
                >
                  <Wrench size={24} />
                  <span>Services</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chatbot"
                  onClick={closeSidebar}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-black transition text-sm"
                >
                  <Bot size={24} />
                  <span>AI Assistant</span>
                </Link>
              </li>
            </ul>
          </nav>

          <button
            onClick={() => {
              handleLogout();
              closeSidebar();
            }}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 transition mt-auto text-sm"
          >
            <LogOut size={24} />
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
