"use client"; // Ensure this is a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Directory
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Now uses next/navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsSuccess(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/auth/login`, // Corrected login URL
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to log in');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/auth/forgot-password`, // Corrected forgot-password URL
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: resetEmail }),
        }
      );

      if (response.ok) {
        alert('Check your email for reset instructions');
      } else {
        alert('Failed to send reset instructions');
      }
    } catch (err) {
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen flex flex-col justify-center items-center py-12">
      <div className="max-w-md w-full bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">Login</h1>

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
                className="w-full p-3 mb-4 border rounded-md text-black dark:text-white bg-white dark:bg-gray-700"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-black text-white rounded-md"
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
                className="w-full p-3 mb-4 border rounded-md text-black dark:text-white bg-white dark:bg-gray-700"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 mb-4 border rounded-md text-black dark:text-white bg-white dark:bg-gray-700"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-md text-white bg-black ${
                loading ? 'bg-gray-500 cursor-not-allowed' : 'hover:bg-gray-700'
              }`}
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>
            <p className="text-center mt-4">
              <button
                onClick={() => setIsForgotPassword(true)}
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </p>
          </form>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
