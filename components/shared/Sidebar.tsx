'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  HomeIcon,
  UsersIcon,
  BriefcaseIcon,
  CalendarIcon,
  DocumentTextIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

const allLinks = {
  admin: [
    { href: '/admin', label: 'Dashboard', icon: CogIcon },
    { href: '/dashboard/clients', label: 'All Clients', icon: UsersIcon },
    { href: '/dashboard/cases', label: 'All Cases', icon: BriefcaseIcon },
  ],
  lawyer: [
    { href: '/lawyer', label: 'My Dashboard', icon: CogIcon },
    { href: '/dashboard/cases', label: 'My Cases', icon: BriefcaseIcon },
    { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarIcon },
  ],
  user: [
    { href: '/user', label: 'My Dashboard', icon: CogIcon },
    { href: '/dashboard/cases', label: 'My Cases', icon: BriefcaseIcon },
    { href: '/dashboard/documents', label: 'Documents', icon: DocumentTextIcon },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<keyof typeof allLinks | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as keyof typeof allLinks | null;
    setRole(storedRole || 'user');
  }, [pathname]);

  const links = role ? allLinks[role] : [];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-center">JurisConnect</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <Link
          href="/home"
          className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
            pathname === '/home'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <HomeIcon className="h-6 w-6 mr-3" />
          Home
        </Link>
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                pathname === link.href
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <LinkIcon className="h-6 w-6 mr-3" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
