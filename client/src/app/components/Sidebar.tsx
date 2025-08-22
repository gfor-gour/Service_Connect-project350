"use client";

import type React from "react";

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
  Menu,
} from "lucide-react";

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true); // minimized by default

  useEffect(() => {
    if (onToggle) {
      onToggle(collapsed);
    }
  }, [collapsed, onToggle]);

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
      {/* Top Navbar */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 items-center justify-between px-4 z-40">
        {/* Menu toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex-1 text-center">
          <span className="text-sm font-medium text-gray-800">
            {userName || "User"}
          </span>
        </div>

        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
          {userName ? userName[0].toUpperCase() : "U"}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white text-black py-4 px-3 flex-col shadow-lg transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
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
        className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-[280px] bg-white text-black py-8 px-6 transform transition-transform duration-300 ease-in-out z-50 shadow-xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col pt-12">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold">Menu</h2>
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
