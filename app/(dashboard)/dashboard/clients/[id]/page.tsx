'use client';
import { useState } from 'react';
import Card from '@/components/shared/Card';
import Table from '@/components/shared/Table';
import { clients, cases, notes } from '@/lib/data';
import Link from 'next/link';

export default function ClientDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const client = clients.find((c) => c.id === params.id);
  const clientCases = cases.filter((c) => c.clientId === params.id);
  const clientNotes = notes.filter((n) => n.clientId === params.id);

  const [activeTab, setActiveTab] = useState('cases');

  if (!client) {
    return <div>Client not found</div>;
  }

  const casesColumns = [
    { header: 'Case Name', accessor: 'name' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Actions',
      accessor: 'id',
      cell: ({ value }: { value: string }) => (
        <Link href={`/dashboard/cases/${value}`} className="text-blue-500 hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{client.name}</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Edit Client
          </button>
          <button className="px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700">
            Add New Case
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Contact Information">
            <div className="space-y-2">
              <p><strong>Email:</strong> {client.email}</p>
              <p><strong>Phone:</strong> {client.phone}</p>
            </div>
          </Card>
          <Card title="Add a Note">
            <form>
              <textarea
                rows={4}
                className="w-full p-2 border rounded-md"
                placeholder="Type your note here..."
              ></textarea>
              <button
                type="submit"
                className="w-full mt-2 px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Note
              </button>
            </form>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          <Card title="Client History">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('cases')}
                  className={`${
                    activeTab === 'cases'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Cases
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`${
                    activeTab === 'notes'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Notes
                </button>
              </nav>
            </div>
            <div className="mt-6">
              {activeTab === 'cases' && (
                <Table columns={casesColumns} data={clientCases} />
              )}
              {activeTab === 'notes' && (
                <ul className="space-y-4">
                  {clientNotes.map((note) => (
                    <li key={note.id} className="p-4 bg-gray-50 rounded-lg">
                      {note.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
