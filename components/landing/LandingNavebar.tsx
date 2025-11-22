import Link from 'next/link';

export default function LandingNavbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <Link href="/">Pro Bono CRM</Link>
        </div>
        <div className="flex space-x-4">
          <Link href="#features" className="text-gray-600 hover:text-gray-800">Features</Link>
          <Link href="#about" className="text-gray-600 hover:text-gray-800">About</Link>
          <Link href="#testimonials" className="text-gray-600 hover:text-gray-800">Testimonials</Link>
          <Link href="/login" className="px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
