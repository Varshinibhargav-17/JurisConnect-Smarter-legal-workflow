'use client';
import StatsCard from '@/components/shared/StatsCard';
import Table from '@/components/shared/Table';
import { cases, appointments } from '@/lib/data';
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// In a real app, you'd get this from the user's session
const currentLawyer = 'Lawyer One';

export default function LawyerDashboard() {
  const myCases = cases.filter((c) => c.assignee === currentLawyer);
  const myAppointments = appointments.filter(
    (a) => a.lawyer === currentLawyer
  );

  const stats = [
    {
      title: 'My Active Cases',
      value: myCases.filter((c) => c.status === 'Open').length,
      icon: BriefcaseIcon,
    },
    {
      title: 'Upcoming Appointments',
      value: myAppointments.length,
      icon: CalendarDaysIcon,
    },
    {
      title: 'Resolved Cases',
      value: myCases.filter((c) => c.status === 'Closed').length,
      icon: CheckCircleIcon,
    },
    {
      title: 'Pending Tasks',
      value: '8', // Placeholder
      icon: ClockIcon,
    },
  ];

  const caseColumns = [
    { header: 'Case ID', accessor: 'id' },
    { header: 'Client', accessor: 'clientName' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Action',
      accessor: 'id',
      cell: ({ value }: { value: string }) => (
        <Link href={`/dashboard/cases/${value}`} className="text-blue-500 hover:underline">
          View
        </Link>
      ),
    },
  ];

  const appointmentColumns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Time', accessor: 'time' },
    { header: 'Client', accessor: 'clientName' },
    { header: 'Notes', accessor: 'title' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Lawyer Dashboard</h1>

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
        {/* My Cases Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Assigned Cases</h2>
          <Table columns={caseColumns} data={myCases} />
        </div>

        {/* My Upcoming Appointments Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Upcoming Appointments</h2>
          <Table columns={appointmentColumns} data={myAppointments} />
        </div>
      </div>
    </div>
  );
}
