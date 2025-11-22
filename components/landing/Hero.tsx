import Link from 'next/link';

export default function Hero() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800">
          Streamline Your Pro Bono Work
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          A modern CRM designed for nonprofit law firms to manage clients, cases, and documents efficiently.
        </p>
        <div className="mt-8">
          <Link href="/signup" className="px-6 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Get Started for Free
          </Link>
        </div>
      </div>
    </div>
  );
}
