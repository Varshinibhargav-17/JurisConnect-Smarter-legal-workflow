import Table from '@/components/shared/Table';
import { clients } from '@/lib/data';

export default function ClientsPage() {
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
  ];
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Clients</h1>
      <Table columns={columns} data={clients} />
    </div>
  );
}
