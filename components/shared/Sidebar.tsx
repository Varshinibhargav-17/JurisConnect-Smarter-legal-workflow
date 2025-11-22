'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const allLinks = {
  admin: [
    { href: '/admin', label: 'Admin Dashboard' },
    { href: '/dashboard/clients', label: 'All Clients' },
    { href: '/dashboard/cases', label: 'All Cases' },
  ],
  lawyer: [
    { href: '/lawyer', label: 'My Dashboard' },
    { href: '/dashboard/cases', label: 'My Cases' },
    { href: '/dashboard/appointments', label: 'My Appointments' },
  ],
  user: [
    { href: '/user', label: 'My Dashboard' },
    { href: '/dashboard/cases', label: 'My Cases' },
    { href: '/dashboard/documents', label: 'My Documents' },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<keyof typeof allLinks | null>(null);

  useEffect(() => {
    // Simulating getting role from auth context or session
    const storedRole = localStorage.getItem('userRole') as keyof typeof allLinks | null;
    setRole(storedRole || 'user'); // Default to 'user' if no role is found
  }, [pathname]);

  const links = role ? allLinks[role] : [];

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Pro Bono CRM</h1>
      </div>
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                  pathname === link.href ? 'bg-gray-200 font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
