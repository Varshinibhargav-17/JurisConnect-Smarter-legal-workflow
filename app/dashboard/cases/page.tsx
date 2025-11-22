import Table from '@/components/shared/Table';
import { cases } from '@/lib/data';

export default function CasesPage() {
  const columns = [
    { header: 'Case Name', accessor: 'name' },
    { header: 'Client', accessor: 'clientName' },
    { header: 'Status', accessor: 'status' },
  ];
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Cases</h1>
      <Table columns={columns} data={cases} />
    </div>
  );
}
