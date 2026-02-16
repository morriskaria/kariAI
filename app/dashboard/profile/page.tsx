'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/lib/auth-store';
import { User, Mail, Calendar, Shield, Award } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
            <p className="text-slate-600 mt-1">View and manage your profile information</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold text-white">
                      {user?.firstName?.[0] || user?.email?.[0].toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-slate-600 mt-1">{user?.email}</p>
                  
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>Joined February 2026</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg border border-teal-200 p-6 mt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-900">Professional Plan</h3>
                </div>
                <p className="text-sm text-slate-600">
                  You have access to all professional features
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <User className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">Full Name</p>
                      <p className="font-medium text-slate-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">Email Address</p>
                      <p className="font-medium text-slate-900">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Shield className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">Account Status</p>
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Statistics */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Account Statistics
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Total Chatbots</p>
                    <p className="text-3xl font-bold text-slate-900">5</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Total Conversations</p>
                    <p className="text-3xl font-bold text-slate-900">2,543</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Avg Response Time</p>
                    <p className="text-3xl font-bold text-slate-900">1.2s</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Customer Satisfaction</p>
                    <p className="text-3xl font-bold text-slate-900">94%</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    {
                      action: 'Created new chatbot',
                      details: 'Customer Support Bot',
                      time: '2 days ago',
                    },
                    {
                      action: 'Updated bot settings',
                      details: 'Sales Assistant',
                      time: '5 days ago',
                    },
                    {
                      action: 'Reviewed analytics',
                      details: 'FAQ Bot',
                      time: '1 week ago',
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{activity.details}</p>
                      </div>
                      <span className="text-xs text-slate-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
