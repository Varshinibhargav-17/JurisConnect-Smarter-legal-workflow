import { Metadata } from 'next';
import UserDashboard from './UserDashboard';

export const metadata: Metadata = {
  title: 'User Dashboard',
};

export default function UserPage() {
    return <UserDashboard />;
}
