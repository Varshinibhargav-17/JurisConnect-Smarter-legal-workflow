'use client';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you'd clear the auth state
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <SearchBar />
      <div>
        <button onClick={handleLogout} className="font-medium text-blue-600 hover:underline">
          Logout
        </button>
      </div>
    </header>
  );
}
