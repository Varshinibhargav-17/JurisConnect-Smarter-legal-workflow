'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  // const [role, setRole] = useState('user'); // Dummy role selection removed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a placeholder for actual authentication logic.
    // In a real application, you would send credentials to a backend API for verification.
    // Upon successful authentication, the backend would typically return a token and user role.
    // For now, we'll redirect to a default dashboard as the dummy login is removed.
    console.log('Login form submitted. Placeholder for backend authentication.');
    router.push('/dashboard/home'); // Redirect to a default dashboard page
  };

  return (
    <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            // defaultValue="test@example.com" // Removed dummy default value
            className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            // defaultValue="password" // Removed dummy default value
            className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Role selection removed as per user request */}
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Login
        </button>
      </form>
      <p className="text-sm text-center text-gray-600">
        Don't have an account?{' '}
        <Link href="/signup" className="font-medium text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
      <div className="text-center mt-4">
        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:underline">
          Back to main website
        </Link>
      </div>
    </div>
  );
}
