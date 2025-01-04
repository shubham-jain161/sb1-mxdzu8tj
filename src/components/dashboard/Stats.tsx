import React from 'react';
import { Users, Mail, MessageSquare, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
}

function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="text-blue-600">{icon}</div>
      </div>
      {trend && (
        <div className="mt-2 flex items-center text-sm">
          <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
          <span className="text-green-500">{trend}% increase</span>
        </div>
      )}
    </div>
  );
}

export default function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Leads"
        value={1234}
        icon={<Users className="w-6 h-6" />}
        trend={12}
      />
      <StatsCard
        title="Active Campaigns"
        value={8}
        icon={<Mail className="w-6 h-6" />}
        trend={5}
      />
      <StatsCard
        title="Open Conversations"
        value={42}
        icon={<MessageSquare className="w-6 h-6" />}
        trend={8}
      />
      <StatsCard
        title="Response Rate"
        value={28}
        icon={<TrendingUp className="w-6 h-6" />}
      />
    </div>
  );
}