import { cn } from '@/lib/utils';
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className }: CardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-xl border border-gray-200 shadow-sm", className)}>
      {title && <h2 className="text-lg font-semibold mb-4 text-gray-900">{title}</h2>}
      <div>{children}</div>
    </div>
  );
}
