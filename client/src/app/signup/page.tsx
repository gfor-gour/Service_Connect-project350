"use client";

import { useState } from "react";
import Link from "next/link";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // New state for success message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsSuccess(false); // Reset success state before making the request

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role }),
        }
      );

      if (response.ok) {
        setIsSuccess(true); // Set success state if registration is successful
        setTimeout(() => {
          window.location.href = "/login"; // Redirect after a short delay
        }, 2000); // Wait for 2 seconds to show success message
      } else {
        const data = await response.json();
        setError(data.message || "Failed to sign up");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen flex flex-col justify-center items-center py-12">
      <div className="max-w-md w-full bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        {/* Lock Icon SVG with Sign Up Logo */}
        <div className="text-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="mx-auto mb-4 w-24 h-24 text-violet-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v12m-3-9l3 3 3-3"
            />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Sign Up
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {isSuccess && (
          <p className="text-green-500 mb-4 text-center">
            Registered successfully! Redirecting to login...
          </p>
        )}

        {!isSuccess && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 border rounded-md text-black dark:text-white bg-white dark:bg-gray-700"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border rounded-md text-black dark:text-white bg-white dark:bg-gray-700"
                required
              />
            </div>

            <div className="mb-4">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border rounded-md text-black dark:text-white bg-white dark:bg-gray-700 focus:ring-violet-600 focus:border-violet-600"
              >
                <option value="user">User</option>
                <option value="provider">Provider</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-md text-white bg-black ${
                loading ? "bg-gray-500 cursor-not-allowed" : "hover:bg-gray-700"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm">
            Already registered?{" "}
            <Link href="/login" className="text-violet-600 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
