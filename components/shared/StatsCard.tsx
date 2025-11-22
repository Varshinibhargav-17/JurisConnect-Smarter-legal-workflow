import { ElementType } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: ElementType;
}

export default function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
