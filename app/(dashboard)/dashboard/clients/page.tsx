'use client';
import { useState } from 'react';
import Link from 'next/link';
import Table from '@/components/shared/Table';
import { clients } from '@/lib/data';
import Card from '@/components/shared/Card';
import SearchBar from '@/components/shared/SearchBar';
import { PlusIcon } from '@heroicons/react/24/outline';

const StatusBadge = ({ status }: { status: 'Active' | 'Inactive' }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
  const statusClasses = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-gray-100 text-gray-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

export default function ClientsPage() {
  const columns = [
    { 
      header: 'Name', 
      accessor: 'name',
      cell: ({ value }: { value: string }) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img className="h-10 w-10 rounded-full" src={`https://i.pravatar.cc/150?u=${value}`} alt="" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{value}</div>
          </div>
        </div>
      )
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Status',
      accessor: 'status',
      cell: ({ value }: { value: 'Active' | 'Inactive' }) => <StatusBadge status={value} />,
    },
    {
      header: '',
      accessor: 'id',
      cell: ({ value }: { value: string }) => (
        <Link href={`/dashboard/clients/${value}`} className="text-blue-600 hover:underline text-sm font-medium">
          View Details
        </Link>
      ),
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your clients and their information.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <SearchBar
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Client
          </button>
        </div>
      </div>
      <Card className="!p-0">
        <Table columns={columns} data={filteredClients} />
      </Card>
    </div>
  );
}
