'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/lib/auth-store';
import { Bell, Lock, CreditCard, Globe, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Tabs Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-200 p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">General Settings</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        disabled
                      />
                      <p className="text-sm text-slate-500 mt-1">
                        Contact support to change your email address
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.firstName || ''}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.lastName || ''}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                      Save Changes
                    </button>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Security Settings</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                      Update Password
                    </button>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      {[
                        { label: 'Email notifications for new conversations', defaultChecked: true },
                        { label: 'Weekly analytics summary', defaultChecked: true },
                        { label: 'Bot performance alerts', defaultChecked: true },
                        { label: 'Billing and payment updates', defaultChecked: true },
                        { label: 'Product updates and news', defaultChecked: false },
                      ].map((item, index) => (
                        <label key={index} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={item.defaultChecked}
                            className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                          />
                          <span className="text-slate-700">{item.label}</span>
                        </label>
                      ))}
                    </div>

                    <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                      Save Preferences
                    </button>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Billing & Subscription</h2>
                    
                    <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-6 border border-teal-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Professional Plan</h3>
                          <p className="text-slate-600">KES 7,500/month</p>
                        </div>
                        <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        Next billing date: March 16, 2026
                      </p>
                      <button className="text-teal-600 font-medium hover:text-teal-700">
                        Change Plan →
                      </button>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 mb-4">Payment Method</h3>
                      <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900">•••• 4242</p>
                            <p className="text-sm text-slate-500">Expires 12/27</p>
                          </div>
                        </div>
                        <button className="text-teal-600 font-medium hover:text-teal-700">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Privacy & Data</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-slate-900 mb-2">Data Export</h3>
                        <p className="text-sm text-slate-600 mb-3">
                          Download all your data including conversations and analytics
                        </p>
                        <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                          Request Data Export
                        </button>
                      </div>

                      <div className="pt-4 border-t border-slate-200">
                        <h3 className="font-medium text-slate-900 mb-2 text-red-600">
                          Delete Account
                        </h3>
                        <p className="text-sm text-slate-600 mb-3">
                          Permanently delete your account and all associated data
                        </p>
                        <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
