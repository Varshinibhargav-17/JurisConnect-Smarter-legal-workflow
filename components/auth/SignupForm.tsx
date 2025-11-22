'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AtSymbolIcon, LockClosedIcon, UserIcon, PhoneIcon, MapPinIcon, IdentificationIcon } from '@heroicons/react/24/outline';

export default function SignupForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/login');
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Join our platform today.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="name"
            type="text"
            required
            placeholder="Full Name"
            className="w-full pl-10 pr-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="relative">
          <AtSymbolIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="email"
            type="email"
            required
            placeholder="email@example.com"
            className="w-full pl-10 pr-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="relative">
          <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="phone"
            type="tel"
            required
            placeholder="Phone Number"
            className="w-full pl-10 pr-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="address"
            type="text"
            required
            placeholder="Address"
            className="w-full pl-10 pr-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="relative">
          <IdentificationIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="userid"
            type="text"
            required
            placeholder="User ID"
            className="w-full pl-10 pr-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="relative">
          <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="password"
            type="password"
            required
            placeholder="Password"
            className="w-full pl-10 pr-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="relative">
          <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="confirm-password"
            type="password"
            required
            placeholder="Confirm Password"
            className="w-full pl-10 pr-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform duration-150 ease-in-out active:scale-95"
        >
          Create Account
        </button>
      </form>
      <div className="relative flex items-center justify-center w-full my-4">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-4 text-xs text-gray-500 uppercase">Or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
      <div className="space-y-3">
        <button className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          <span className="font-medium text-sm text-gray-700">Sign up with Google</span>
        </button>
        <button className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          <span className="font-medium text-sm text-gray-700">Sign up with GitHub</span>
        </button>
      </div>
      <p className="text-sm text-center text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Log in
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
