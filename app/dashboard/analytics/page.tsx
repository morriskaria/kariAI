'use client';

import { useState } from 'react';
import { TrendingUp, Users, MessageCircle, Clock, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const stats = [
    {
      label: 'Total Conversations',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: MessageCircle,
    },
    {
      label: 'Active Users',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
    },
    {
      label: 'Avg. Response Time',
      value: '1.2s',
      change: '-5.3%',
      trend: 'down',
      icon: Clock,
    },
    {
      label: 'User Satisfaction',
      value: '4.8/5',
      change: '+2.1%',
      trend: 'up',
      icon: Activity,
    },
  ];

  const conversationData = [
    { day: 'Mon', conversations: 120, users: 85 },
    { day: 'Tue', conversations: 150, users: 110 },
    { day: 'Wed', conversations: 180, users: 135 },
    { day: 'Thu', conversations: 160, users: 120 },
    { day: 'Fri', conversations: 200, users: 155 },
    { day: 'Sat', conversations: 140, users: 100 },
    { day: 'Sun', conversations: 110, users: 80 },
  ];

  const maxConversations = Math.max(...conversationData.map((d) => d.conversations));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Analytics</h1>
            <p className="text-gray-400 mt-2">Track your chatbot performance and user engagement</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 transition-all"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.trend === 'up';

            return (
              <div
                key={index}
                className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{stat.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Conversation Trends */}
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
            <h2 className="text-xl font-bold mb-6">Conversation Trends</h2>
            <div className="space-y-4">
              {conversationData.map((data, index) => {
                const barHeight = (data.conversations / maxConversations) * 100;
                return (
                  <div key={index} className="flex items-end gap-4">
                    <div className="w-12 text-sm font-medium text-gray-400">{data.day}</div>
                    <div className="flex-1 flex items-end gap-2 h-16">
                      <div
                        className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t transition-all hover:from-emerald-600 hover:to-emerald-500"
                        style={{ height: `${barHeight}%` }}
                        title={`${data.conversations} conversations`}
                      ></div>
                      <div className="text-xs text-gray-400">{data.conversations}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Activity */}
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
            <h2 className="text-xl font-bold mb-6">User Activity</h2>
            <div className="space-y-4">
              {conversationData.map((data, index) => {
                const barHeight = (data.users / Math.max(...conversationData.map((d) => d.users))) * 100;
                return (
                  <div key={index} className="flex items-end gap-4">
                    <div className="w-12 text-sm font-medium text-gray-400">{data.day}</div>
                    <div className="flex-1 flex items-end gap-2 h-16">
                      <div
                        className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:from-blue-600 hover:to-blue-500"
                        style={{ height: `${barHeight}%` }}
                        title={`${data.users} users`}
                      ></div>
                      <div className="text-xs text-gray-400">{data.users}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Performing Bots */}
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
            <h2 className="text-xl font-bold mb-6">Top Performing Bots</h2>
            <div className="space-y-4">
              {[
                { name: 'Customer Support Bot', conversations: 1200, satisfaction: 4.9 },
                { name: 'Sales Assistant', conversations: 890, satisfaction: 4.7 },
                { name: 'FAQ Bot', conversations: 757, satisfaction: 4.6 },
              ].map((bot, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 border border-emerald-500/10 rounded-lg hover:border-emerald-500/30 transition-all">
                  <div>
                    <div className="font-medium">{bot.name}</div>
                    <div className="text-sm text-gray-400">{bot.conversations} conversations</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-emerald-400">{bot.satisfaction}/5</div>
                    <div className="text-xs text-gray-400">satisfaction</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Satisfaction Distribution */}
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
            <h2 className="text-xl font-bold mb-6">Satisfaction Distribution</h2>
            <div className="space-y-4">
              {[
                { rating: '5 stars', percentage: 65, count: 1847 },
                { rating: '4 stars', percentage: 25, count: 710 },
                { rating: '3 stars', percentage: 7, count: 199 },
                { rating: '2 stars', percentage: 2, count: 57 },
                { rating: '1 star', percentage: 1, count: 28 },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-gray-400">{item.rating}</div>
                  <div className="flex-1">
                    <div className="h-2 bg-emerald-500/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm text-gray-400">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'New conversation started', bot: 'Customer Support Bot', time: '2 minutes ago' },
              { action: 'Bot response sent', bot: 'Sales Assistant', time: '5 minutes ago' },
              { action: 'User rated conversation', bot: 'FAQ Bot', time: '12 minutes ago', rating: '5 stars' },
              { action: 'New conversation started', bot: 'Customer Support Bot', time: '18 minutes ago' },
              { action: 'Bot configuration updated', bot: 'Sales Assistant', time: '1 hour ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 border border-emerald-500/10 rounded-lg hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-gray-400">{activity.bot}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">{activity.time}</div>
                  {activity.rating && <div className="text-xs text-emerald-400">{activity.rating}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
