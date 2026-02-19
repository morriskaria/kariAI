'use client';

import { useState } from 'react';
import { Settings, User, Lock, Bell, CreditCard, Trash2, Save, Check, Download } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuthStore } from '@/lib/auth-store';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: user?.email || '',
    phone: '+254 712 345 678',
    company: 'Acme Corp',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    conversationAlerts: true,
    weeklyReport: true,
    productUpdates: false,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-emerald-500/10 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-gray-400 hover:text-emerald-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={profileData.company}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg font-semibold transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                  {saved && (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="w-5 h-5" />
                      <span>Saved successfully</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
                <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={securityData.currentPassword}
                      onChange={handleSecurityChange}
                      className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={securityData.newPassword}
                      onChange={handleSecurityChange}
                      className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={securityData.confirmPassword}
                      onChange={handleSecurityChange}
                      className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg font-semibold transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Update Password
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent p-6">
                <h2 className="text-2xl font-bold mb-4 text-red-400">Danger Zone</h2>
                <p className="text-gray-400 mb-4">Delete your account and all associated data</p>
                <button className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-all border border-red-500/30">
                  <Trash2 className="w-5 h-5" />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
              <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-white/5 border border-emerald-500/10 rounded-lg hover:border-emerald-500/30 transition-all">
                    <div>
                      <div className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {key === 'emailNotifications' && 'Receive email notifications for important events'}
                        {key === 'conversationAlerts' && 'Get alerts when new conversations start'}
                        {key === 'weeklyReport' && 'Receive weekly performance reports'}
                        {key === 'productUpdates' && 'Get notified about new features and updates'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key)}
                      className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${
                        value ? 'bg-emerald-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          value ? 'translate-x-6' : ''
                        }`}
                      ></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
                <h2 className="text-2xl font-bold mb-6">Current Plan</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 border border-emerald-500/20 rounded-lg">
                    <div className="text-sm text-gray-400">Plan</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-2">Growth</div>
                  </div>
                  <div className="p-4 bg-white/5 border border-emerald-500/20 rounded-lg">
                    <div className="text-sm text-gray-400">Billing Cycle</div>
                    <div className="text-2xl font-bold mt-2">Monthly</div>
                  </div>
                  <div className="p-4 bg-white/5 border border-emerald-500/20 rounded-lg">
                    <div className="text-sm text-gray-400">Next Billing</div>
                    <div className="text-2xl font-bold mt-2">Mar 19, 2026</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
                <h2 className="text-2xl font-bold mb-6">Billing History</h2>
                <div className="space-y-3">
                  {[
                    { date: 'Feb 19, 2026', amount: '$49.99', status: 'Paid' },
                    { date: 'Jan 19, 2026', amount: '$49.99', status: 'Paid' },
                    { date: 'Dec 19, 2025', amount: '$49.99', status: 'Paid' },
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 border border-emerald-500/10 rounded-lg hover:border-emerald-500/30 transition-all">
                      <div>
                        <div className="font-medium">{invoice.date}</div>
                        <div className="text-sm text-gray-400">{invoice.amount}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-medium">{invoice.status}</span>
                        <button className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
                <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                <div className="p-4 bg-white/5 border border-emerald-500/20 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Visa ending in 4242</div>
                      <div className="text-sm text-gray-400">Expires 12/2026</div>
                    </div>
                    <button className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
