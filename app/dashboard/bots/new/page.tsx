'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api-client';

export default function NewBotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    systemPrompt: `You are a helpful customer service assistant for a business. 
Your role is to:
- Answer customer questions professionally
- Help with appointment booking or inquiries
- Provide product/service information
- Escalate complex issues to a human agent
- Be friendly, helpful, and professional at all times`,
    tone: 'professional',
    model: 'gpt-4-turbo',
    temperature: 0.7,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'temperature' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Chatbot name is required');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.createBot(formData);
      const botId = response.data.id;
      router.push(`/dashboard/bots/${botId}`);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create chatbot. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/bots" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Create New Chatbot</h1>
            <p className="text-slate-600 mt-1">Set up your AI chatbot in minutes</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Chatbot Name *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Customer Support Bot"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-slate-500 mt-1">This name will be visible to your customers</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what this chatbot will do..."
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">Optional: Help you remember the chatbot's purpose</p>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Configuration</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tone" className="block text-sm font-medium text-slate-700 mb-2">
                  Tone
                </label>
                <select
                  id="tone"
                  name="tone"
                  value={formData.tone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-slate-700 mb-2">
                  AI Model
                </label>
                <select
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="gpt-4-turbo">GPT-4 Turbo (Best Quality)</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast & Affordable)</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">Different models have different speeds and costs</p>
              </div>
            </div>

            <div>
              <label htmlFor="temperature" className="block text-sm font-medium text-slate-700 mb-2">
                Temperature: {formData.temperature.toFixed(1)}
              </label>
              <input
                id="temperature"
                type="range"
                name="temperature"
                min="0"
                max="1"
                step="0.1"
                value={formData.temperature}
                onChange={handleInputChange}
                className="w-full"
              />
              <p className="text-xs text-slate-500 mt-1">
                Lower (0.0) = More focused and deterministic. Higher (1.0) = More creative and random.
              </p>
            </div>
          </div>

          {/* System Prompt */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">System Prompt</h2>
            <p className="text-sm text-slate-600">
              This defines how your chatbot behaves. Edit it to match your business needs.
            </p>
            <textarea
              name="systemPrompt"
              value={formData.systemPrompt}
              onChange={handleInputChange}
              rows={8}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href="/dashboard/bots"
              className="px-6 py-3 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Creating...' : 'Create Chatbot'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
