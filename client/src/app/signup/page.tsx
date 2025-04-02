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
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white min-h-screen flex flex-col justify-center items-center py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl">
        {/* Updated Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
            Sign Up
          </h1>
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
          Create your account to access trusted local services. It's quick, easy, and secure!
        </p>

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
                className="w-full p-3 border rounded-md text-black dark:text-white bg-gray-100 dark:bg-gray-800"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border rounded-md text-black dark:text-white bg-gray-100 dark:bg-gray-800"
                required
              />
            </div>

            <div className="mb-4">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border rounded-md text-black dark:text-white bg-gray-100 dark:bg-gray-800 focus:ring-indigo-600 focus:border-indigo-600"
              >
                <option value="user">User</option>
                <option value="provider">Provider</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-md text-white bg-indigo-600 ${
                loading ? "bg-indigo-400 cursor-not-allowed" : "hover:bg-indigo-700"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Already registered?
          </p>
          <Link
            href="/login"
            className="inline-block mt-2 px-6 py-2 text-sm font-bold text-indigo-600 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
