"use client";

import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-6 bg-white dark:bg-black border-b border-black dark:border-white">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-black dark:text-white">
        ServiceConnect
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-6">
        <li>
          <Link
            href="/services"
            className="text-black dark:text-white hover:underline"
          >
            Services
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="text-black dark:text-white hover:underline"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="text-black dark:text-white hover:underline"
          >
            Contact
          </Link>
        </li>
      </ul>

      {/* Buttons */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/login"
          className="px-4 py-2 border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-black dark:text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      <div
        className={`absolute top-0 left-0 w-full h-screen bg-white dark:bg-black flex flex-col items-center justify-center gap-6 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <button
          className="absolute top-4 right-4 text-black dark:text-white text-2xl"
          onClick={() => setIsMenuOpen(false)}
        >
          ✕
        </button>
        <ul className="flex flex-col items-center gap-6">
          <li>
            <Link
              href="/services"
              className="text-black dark:text-white hover:underline text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-black dark:text-white hover:underline text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-black dark:text-white hover:underline text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </li>
        </ul>
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
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

