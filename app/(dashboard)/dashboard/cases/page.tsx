'use client';
import { useState } from 'react';
import Link from 'next/link';
import Table from '@/components/shared/Table';
import { cases } from '@/lib/data';
import Card from '@/components/shared/Card';
import SearchBar from '@/components/shared/SearchBar';
import { PlusIcon } from '@heroicons/react/24/outline';

const StatusBadge = ({ status }: { status: 'Open' | 'Closed' | 'Pending' }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
  const statusClasses = {
    Open: "bg-blue-100 text-blue-800",
    Closed: "bg-gray-100 text-gray-800",
    Pending: "bg-yellow-100 text-yellow-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

export default function CasesPage() {
  const columns = [
    { header: 'Case Name', accessor: 'name' },
    { header: 'Client', accessor: 'clientName' },
    {
      header: 'Status',
      accessor: 'status',
      cell: ({ value }: { value: 'Open' | 'Closed' | 'Pending' }) => <StatusBadge status={value} />,
    },
    {
      header: 'Assignee',
      accessor: 'assignee',
    },
    {
      header: '',
      accessor: 'id',
      cell: ({ value }: { value: string }) => (
        <Link href={`/dashboard/cases/${value}`} className="text-blue-600 hover:underline text-sm font-medium">
          View Details
        </Link>
      ),
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = cases.filter(caseItem =>
    caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cases</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all ongoing and past cases.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <SearchBar
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Case
          </button>
        </div>
      </div>
      <Card className="!p-0">
        <Table columns={columns} data={filteredCases} />
      </Card>
    </div>
  );
}