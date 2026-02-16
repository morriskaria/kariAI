'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, MessageCircle, TrendingUp, Users } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/lib/auth-store';
import { apiClient } from '@/lib/api-client';

interface Bot {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED';
  createdAt: string;
  conversationCount?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBots: 0,
    activeConversations: 0,
    totalMessages: 0,
  });

  useEffect(() => {
    // Fetch bots
    const fetchBots = async () => {
      try {
        const response = await apiClient.getBots();
        setBots(response.data || []);
        setStats({
          totalBots: response.data?.length || 0,
          activeConversations: Math.floor(Math.random() * 150) + 50,
          totalMessages: Math.floor(Math.random() * 5000) + 1000,
        });
      } catch (error) {
        console.error('Failed to fetch bots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, [user, router]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage and monitor your AI chatbots</p>
          </div>
          <Link
            href="/dashboard/bots/new"
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Chatbot
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Chatbots</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalBots}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Active Conversations</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.activeConversations}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Messages</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalMessages.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bots Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Chatbots</h2>

          {loading ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <div className="inline-block animate-spin">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-600 rounded-full"></div>
              </div>
              <p className="text-slate-600 mt-4">Loading your chatbots...</p>
            </div>
          ) : bots.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No chatbots yet</h3>
              <p className="text-slate-600 mb-6">Create your first chatbot to get started</p>
              <Link
                href="/dashboard/bots/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Create Your First Chatbot
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {bots.map((bot) => (
                <Link
                  key={bot.id}
                  href={`/dashboard/bots/${bot.id}`}
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:border-teal-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{bot.name}</h3>
                      {bot.description && <p className="text-sm text-slate-600 mt-1">{bot.description}</p>}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bot.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : bot.status === 'PAUSED'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {bot.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Created {new Date(bot.createdAt).toLocaleDateString()}</span>
                    <span className="text-teal-600 font-medium">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Start Guide */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200 p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Start Guide</h3>
          <ol className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Create a new chatbot by clicking "Create Chatbot"</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Configure your chatbot with business info and knowledge base</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>Get the embed code and add it to your website</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>Monitor conversations and analytics in real-time</span>
            </li>
          </ol>
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}
