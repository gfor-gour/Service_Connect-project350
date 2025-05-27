"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="flex items-center justify-between p-6 bg-gray-800 text-white shadow-lg relative">
      {/* Logo */}
      <Link href="/" className="text-2xl font-extrabold tracking-wide">
        <span className="bg-white text-gray-800 px-3 py-1 rounded-md shadow-md">Service</span>
        <span className="ml-2">Connect</span>
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-8">
        <li>
          <Link
            href="/about"
            className="text-lg font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-gray-800 transition-all duration-200"
          >
            About Us
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="text-lg font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-gray-800 transition-all duration-200"
          >
            Contact
          </Link>
        </li>
      </ul>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/login"
          className="px-6 py-2 text-lg font-bold text-gray-800 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="px-6 py-2 text-lg font-bold text-white bg-gray-700 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-200"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-gray-800 text-white flex flex-col shadow-2xl transition-transform duration-300 z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <span className="text-xl font-bold">Menu</span>
          <button
            className="text-white p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex flex-col flex-1 p-6">
          {/* Navigation Links */}
          <ul className="flex flex-col gap-4 mb-8">
            <li>
              <Link
                href="/about"
                className="block text-lg font-semibold px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block text-lg font-semibold px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Mobile Buttons */}
          <div className="flex flex-col gap-4 mt-auto">
            <Link
              href="/login"
              className="px-6 py-3 text-lg font-bold text-gray-800 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200 text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 text-lg font-bold text-white bg-gray-700 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-200 text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
