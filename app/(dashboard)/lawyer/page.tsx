import { Metadata } from 'next';
import LawyerDashboard from './LawyerDashboard';

export const metadata: Metadata = {
  title: 'Lawyer Dashboard',
};

export default function LawyerPage() {
    return <LawyerDashboard />;
}
