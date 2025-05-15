"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { token } = params;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    setIsSuccess(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/auth/reset-password/${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen flex flex-col justify-center items-center py-12">
      <div className="max-w-md w-full bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">Reset Password</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {isSuccess ? (
          <p className="text-green-500 mb-4 text-center">
            Password reset successfully! Redirecting to login...
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                className="w-full p-3 mb-4 border rounded-md text-black dark:text-white bg-white dark:bg-gray-700"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
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
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

