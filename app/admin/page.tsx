'use client';
import StatsCard from '@/components/shared/StatsCard';
import Table from '@/components/shared/Table';
import { cases, users, recentActivity } from '@/lib/data';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function AdminPage() {
  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: UserGroupIcon,
    },
    {
      title: 'Total Cases',
      value: cases.length,
      icon: BriefcaseIcon,
    },
    {
      title: 'Resolved Cases',
      value: cases.filter((c) => c.status === 'Closed').length,
      icon: CheckCircleIcon,
    },
    {
      title: 'Pending Cases',
      value: cases.filter((c) => c.status === 'Open').length,
      icon: ClockIcon,
    },
  ];

  const caseColumns = [
    { header: 'Case ID', accessor: 'id' },
    { header: 'Client', accessor: 'client' },
    { header: 'Status', accessor: 'status' },
    { header: 'Assigned Lawyer', accessor: 'assignee' },
  ];

  const activityColumns = [
    { header: 'User', accessor: 'user' },
    { header: 'Action', accessor: 'action' },
    { header: 'Timestamp', accessor: 'timestamp' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        {/* All Cases Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Cases</h2>
          <Table columns={caseColumns} data={cases} />
        </div>

        {/* Recent Activity Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Platform Activity</h2>
          <Table columns={activityColumns} data={recentActivity} />
        </div>
      </div>
    </div>
  );
}
