'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { TrendingUp, Users, MessageCircle, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  const metrics = [
    {
      label: 'Total Conversations',
      value: '2,543',
      change: '+12.5%',
      trend: 'up',
      icon: MessageCircle,
      color: 'blue',
    },
    {
      label: 'Active Users',
      value: '1,847',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'green',
    },
    {
      label: 'Avg Response Time',
      value: '1.2s',
      change: '-15%',
      trend: 'down',
      icon: Clock,
      color: 'purple',
    },
    {
      label: 'Satisfaction Rate',
      value: '94%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
            <p className="text-slate-600 mt-1">
              Monitor your chatbot performance and user engagement
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-slate-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg bg-${metric.color}-100 flex items-center justify-center`}
                  >
                    <metric.icon className={`w-5 h-5 text-${metric.color}-600`} />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-orange-600'
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-1">{metric.label}</p>
                <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Conversations Over Time */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Conversations Over Time
              </h3>
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                <p className="text-slate-400">Chart placeholder - Integrate Recharts</p>
              </div>
            </div>

            {/* Top Performing Bots */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Top Performing Bots
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Customer Support Bot', conversations: 1250, percentage: 49 },
                  { name: 'Sales Assistant', conversations: 890, percentage: 35 },
                  { name: 'FAQ Bot', conversations: 403, percentage: 16 },
                ].map((bot, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900">
                        {bot.name}
                      </span>
                      <span className="text-sm text-slate-600">
                        {bot.conversations} convos
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full"
                        style={{ width: `${bot.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Engagement */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">User Engagement</h3>
            <div className="h-80 flex items-center justify-center bg-slate-50 rounded-lg">
              <p className="text-slate-400">Engagement chart placeholder</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                {
                  user: 'John Doe',
                  action: 'started a conversation',
                  bot: 'Customer Support Bot',
                  time: '2 minutes ago',
                },
                {
                  user: 'Jane Smith',
                  action: 'completed a conversation',
                  bot: 'Sales Assistant',
                  time: '5 minutes ago',
                },
                {
                  user: 'Mike Johnson',
                  action: 'started a conversation',
                  bot: 'FAQ Bot',
                  time: '10 minutes ago',
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                >
                  <div>
                    <p className="text-sm text-slate-900">
                      <span className="font-medium">{activity.user}</span>{' '}
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{activity.bot}</p>
                  </div>
                  <span className="text-xs text-slate-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
