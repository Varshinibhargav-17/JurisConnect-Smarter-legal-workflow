import StatsCard from '../shared/StatsCard';
import Table from '../shared/Table';
import Chart from './Chart';
import { recentActivity, caseStats } from '@/lib/data';
import Card from '../shared/Card';

export default function Dashboard() {
  const activityColumns = [
    { header: 'Activity', accessor: 'activity' },
    { header: 'Date', accessor: 'date' },
  ];
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Total Clients">
          <p className="text-3xl font-bold">120</p>
        </Card>
        <Card title="Open Cases">
          <p className="text-3xl font-bold">45</p>
        </Card>
        <Card title="Appointments Today">
          <p className="text-3xl font-bold">8</p>
        </Card>
        <Card title="New Documents">
          <p className="text-3xl font-bold">3</p>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Case Statistics">
          <Chart data={caseStats} />
        </Card>
        <Card title="Recent Activity">
          <Table columns={activityColumns} data={recentActivity} />
        </Card>
      </div>
    </div>
  );
}
