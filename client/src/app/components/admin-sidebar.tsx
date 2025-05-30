"use client"

import { useRouter, usePathname } from "next/navigation"
import { Users, UserCheck, Calendar, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useCallback } from "react"

type MenuItem = {
  label: string
  route: string
  icon: React.ReactNode
}

interface AdminSidebarProps {
  onToggle: (expanded: boolean) => void
}

export default function AdminSidebar({ onToggle }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [adminUsername, setAdminUsername] = useState("")
  const [expanded, setExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Set admin username on mount
  useEffect(() => {
    const username = localStorage.getItem("adminUsername") || "Admin"
    setAdminUsername(username)
  }, [])

  // Handle mobile detection only
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Inform parent on first load
  useEffect(() => {
    onToggle(expanded)
  }, []) // run only once on mount

  const handleToggle = useCallback(() => {
    setExpanded((prev) => {
      const newState = !prev
      onToggle(newState)
      return newState
    })
  }, [onToggle])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUsername")
    router.push("/admin-login")
  }

  const menuItems: MenuItem[] = [
    { label: "Dashboard", route: "/admin-dashboard", icon: <Calendar className="w-5 h-5" /> },
    { label: "Manage Users", route: "/admin-users", icon: <Users className="w-5 h-5" /> },
    { label: "Manage Providers", route: "/admin-providers", icon: <UserCheck className="w-5 h-5" /> },
    { label: "Manage Bookings", route: "/admin-bookings", icon: <Calendar className="w-5 h-5" /> }
  ]

  const isActive = (route: string) => pathname?.startsWith(route)

  return (
    <>
      {/* Mobile overlay */}
      {expanded && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={handleToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-30
          ${expanded ? "w-64" : "w-14"}
          ${isMobile && !expanded ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {expanded && <span className="text-xl font-bold text-gray-900">ServiceConnect</span>}
          <button
            onClick={handleToggle}
            className="text-gray-600 hover:text-gray-900"
            aria-label={expanded ? "Close sidebar" : "Open sidebar"}
          >
            {expanded ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4 px-1">
          {menuItems.map(({ label, route, icon }) => {
            const active = isActive(route)
            return (
              <div
                key={route}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors
                  ${
                    active
                      ? "bg-gray-100 text-gray-900 font-semibold"
                      : "text-gray-700 hover:bg-gray-50 cursor-pointer"
                  }
                `}
                onClick={() => !active && router.push(route)}
              >
                <span className="flex-shrink-0">{icon}</span>
                {expanded && <span>{label}</span>}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 ${
            expanded ? "text-left" : "flex justify-center"
          }`}
        >
          {expanded ? (
            <>
              <div className="text-sm text-gray-600">Welcome, Admin!</div>
              <div className="text-xs text-gray-500">{adminUsername}</div>
              <div className="text-xs text-gray-500 mb-3">Role: admin</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Log out
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Floating toggle button for mobile */}
      {isMobile && !expanded && (
        <button
          onClick={handleToggle}
          className="fixed top-4 left-4 z-40 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )}
    </>
  )
}
