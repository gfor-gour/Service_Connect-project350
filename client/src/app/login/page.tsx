"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsSuccess(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsSuccess(true);

        // Save token, user ID, and email in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("email", data.user.email);

        setTimeout(() => {
          if (data.user.role === "provider") {
            router.push("/provider");
          } else {
            router.push("/user");
          }
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to log in");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail }),
        }
      );

      if (response.ok) {
        alert("Check your email for reset instructions");
      } else {
        alert("Failed to send reset instructions");
      }
    } catch {
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white min-h-screen flex flex-col justify-center items-center py-12">
      <div className="max-w-lg w-full bg-white dark:bg-gray-900 p-10 md:p-12 lg:p-16 rounded-2xl shadow-2xl">
        {/* Updated Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
            Login
          </h1>
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
          Welcome back! Log in to access your account and connect with trusted local services.
        </p>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {isSuccess ? (
          <p className="text-green-500 mb-4 text-center">
            Logged in successfully! Redirecting to profile...
          </p>
        ) : isForgotPassword ? (
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 mb-4 border rounded-md text-black dark:text-white bg-gray-100 dark:bg-gray-800"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 mb-4 border rounded-md text-black dark:text-white bg-gray-100 dark:bg-gray-800"
                required
              />
            </div>

            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border rounded-md text-black dark:text-white bg-gray-100 dark:bg-gray-800 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-4 rounded-md text-xl font-extrabold text-white bg-indigo-600 ${
                loading ? "bg-indigo-400 cursor-not-allowed" : "hover:bg-indigo-700"
              }`}
            >
              {loading ? "Logging In..." : "Login"}
            </button>
            <p className="text-center mt-4">
              <button
                onClick={() => setIsForgotPassword(true)}
                className="inline-block mt-2 px-6 py-2 text-sm font-bold text-indigo-600 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Forgot Password?
              </button>
            </p>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Do not have an account?
          </p>
          <Link
            href="/signup"
            className="inline-block mt-2 px-6 py-2 text-sm font-bold text-indigo-600 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
