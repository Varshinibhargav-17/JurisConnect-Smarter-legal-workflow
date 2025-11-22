'use client';
import StatsCard from '@/components/shared/StatsCard';
import Table from '@/components/shared/Table';
import { cases, documents } from '@/lib/data';
import { BriefcaseIcon, DocumentIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// In a real app, you'd get this from the user's session
const currentClient = 'John Doe';

export default function UserDashboard() {
  const myCases = cases.filter((c) => c.clientName === currentClient);
  const myDocuments = documents.filter((d) => d.clientName === currentClient);

  const stats = [
    {
      title: 'My Active Cases',
      value: myCases.filter((c) => c.status === 'Open').length,
      icon: BriefcaseIcon,
    },
    {
      title: 'My Documents',
      value: myDocuments.length,
      icon: DocumentIcon,
    },
    {
      title: 'Resolved Cases',
      value: myCases.filter((c) => c.status === 'Closed').length,
      icon: CheckCircleIcon,
    },
  ];

  const caseColumns = [
    { header: 'Case ID', accessor: 'id' },
    { header: 'Case Name', accessor: 'name' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Action',
      accessor: 'id',
      cell: ({ value }: { value: string }) => (
        <Link href={`/dashboard/cases/${value}`} className="text-blue-500 hover:underline">
          View Details
        </Link>
      ),
    },
  ];

  const documentColumns = [
    { header: 'File Name', accessor: 'name' },
    { header: 'Uploaded At', accessor: 'uploadedAt' },
    {
        header: 'Action',
        accessor: 'name',
        cell: ({ value }: { value: string }) => (
          <a href={`/documents/${value}`} download className="text-blue-500 hover:underline">
            Download
          </a>
        ),
      },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">User Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value.toString()}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* My Cases Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Cases</h2>
          <Table columns={caseColumns} data={myCases} />
        </div>

        {/* My Documents Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Documents</h2>
          <Table columns={documentColumns} data={myDocuments} />
        </div>
      </div>
    </div>
  );
}
