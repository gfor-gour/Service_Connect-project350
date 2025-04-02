"use client";

import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-lg">
      {/* Logo */}
      <Link href="/" className="text-2xl font-extrabold tracking-wide">
        <span className="bg-white text-indigo-600 px-2 py-1 rounded-md shadow-md">
          Service
        </span>
        <span className="ml-1">Connect</span>
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-8">
        <li>
          <Link
            href="/about"
            className="text-lg font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-indigo-600 transition"
          >
            About Us
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="text-lg font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-indigo-600 transition"
          >
            Contact
          </Link>
        </li>
      </ul>

      {/* Buttons */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/login"
          className="px-6 py-2 text-lg font-bold text-indigo-600 bg-white rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="px-6 py-2 text-lg font-bold text-white bg-purple-700 rounded-lg shadow-md hover:bg-purple-800 transition"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      <div
        className={`absolute top-0 left-0 w-full h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white flex flex-col items-center justify-center gap-6 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <button
          className="absolute top-4 right-4 text-white text-2xl"
          onClick={() => setIsMenuOpen(false)}
        >
          ✕
        </button>
        <ul className="flex flex-col items-center gap-6">
          <li>
            <Link
              href="/about"
              className="text-lg font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-indigo-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-lg font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-indigo-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </li>
        </ul>
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/login"
            className="px-6 py-2 text-lg font-bold text-indigo-600 bg-white rounded-lg shadow-md hover:bg-gray-100 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 text-lg font-bold text-white bg-purple-700 rounded-lg shadow-md hover:bg-purple-800 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
