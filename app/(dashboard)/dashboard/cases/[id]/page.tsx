import StatsCard from '@/components/shared/StatsCard';
import { cases, clients } from '@/lib/data';

export default function CaseDetailsPage({ params }: { params: { id: string } }) {
  const caseItem = cases.find((c) => c.id === params.id);
  const client = clients.find((c) => c.id === caseItem?.clientId);

  if (!caseItem || !client) {
    return <div>Case not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">{caseItem.name}</h1>
      <StatsCard title="Case Details">
        <p>
          <strong>Client:</strong> {client.name}
        </p>
        <p>
          <strong>Status:</strong> {caseItem.status}
        </p>
        <p>
          <strong>Description:</strong> {caseItem.description}
        </p>
      </StatsCard>
    </div>
  );
}
