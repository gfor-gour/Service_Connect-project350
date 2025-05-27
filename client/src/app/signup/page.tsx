"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, UserPlus, ArrowRight, User, Shield } from "lucide-react"

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Optional: Set your background image URL here (same as login)
  const backgroundImage = "/background.avif" // Change this to your desired background image path

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setIsSuccess(false)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.message || "Failed to sign up")
      }
    } catch (error) {
      console.error("Error signing up:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : "linear-gradient(135deg, #1f2937 0%, #374151 50%, #1f2937 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background overlay for better text readability when using background image */}
      {backgroundImage && <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>}

      <div className="relative z-10 w-full max-w-md">
        {/* Main SignUp Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gray-800 px-8 py-10 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-gray-800" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-300 text-sm">Join our platform and connect with trusted local services</p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-8">
            {/* Status Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {isSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm text-center">
                  Account created successfully! Redirecting to login...
                </p>
              </div>
            )}

            {!isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
                    required
                  />
                </div>

                {/* Role Selection */}
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none bg-white"
                  >
                    <option value="user">User - Find Services</option>
                    <option value="provider">Provider - Offer Services</option>
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Role Description */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    {role === "user" ? (
                      <User className="w-5 h-5 text-gray-600 mt-0.5" />
                    ) : (
                      <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm">
                        {role === "user" ? "User Account" : "Provider Account"}
                      </h4>
                      <p className="text-gray-600 text-xs mt-1">
                        {role === "user"
                          ? "Browse and book services from trusted local providers"
                          : "Offer your services and connect with customers in your area"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-800 text-white py-4 rounded-lg font-semibold hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Terms and Privacy */}
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-gray-800 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-gray-800 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </form>
            )}

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm mb-3">Already have an account?</p>
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 focus:ring-4 focus:ring-gray-300"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm">© 2024 Your Service Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
