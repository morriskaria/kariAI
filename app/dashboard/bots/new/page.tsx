'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle, X, Loader2, Copy, Check } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api-client';

export default function NewBotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
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
    maxTokens: 2048,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'temperature' || name === 'maxTokens' ? parseFloat(value) : value,
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

  const copyEmbedCode = () => {
    const embedCode = `<iframe src="https://kariaai.com/embed/bot-id" width="100%" height="600"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors text-gray-400 hover:text-emerald-400"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Create New Chatbot</h1>
            <p className="text-gray-400 mt-1">Configure your AI chatbot with custom settings</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
                <h2 className="text-xl font-bold mb-6">Basic Information</h2>

                <div className="space-y-4">
                  {/* Bot Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Chatbot Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Customer Support Bot"
                      className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder-gray-500"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-2">This name will be visible to your customers</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe what this chatbot will do..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder-gray-500 resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-2">Optional: Help you remember the chatbot's purpose</p>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
                <h2 className="text-xl font-bold mb-6">Configuration</h2>

                <div className="space-y-4">
                  {/* Model & Tone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">AI Model *</label>
                      <select
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                      >
                        <option value="gpt-4-turbo">GPT-4 Turbo (Best Quality)</option>
                        <option value="gpt-4">GPT-4 (Balanced)</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast & Affordable)</option>
                        <option value="claude-3-opus">Claude 3 Opus (Advanced)</option>
                        <option value="claude-3-sonnet">Claude 3 Sonnet (Balanced)</option>
                        <option value="gemini-pro">Gemini Pro (Efficient)</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-2">Different models have different speeds and costs</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Tone</label>
                      <select
                        name="tone"
                        value={formData.tone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                      >
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="casual">Casual</option>
                        <option value="formal">Formal</option>
                        <option value="technical">Technical</option>
                      </select>
                    </div>
                  </div>

                  {/* Temperature & Max Tokens */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Temperature: <span className="text-emerald-400">{formData.temperature.toFixed(2)}</span>
                      </label>
                      <input
                        type="range"
                        name="temperature"
                        value={formData.temperature}
                        onChange={handleInputChange}
                        min="0"
                        max="2"
                        step="0.1"
                        className="w-full h-2 bg-emerald-500/20 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-gray-400 mt-2">Lower = focused, Higher = creative</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Max Tokens</label>
                      <input
                        type="number"
                        name="maxTokens"
                        value={formData.maxTokens}
                        onChange={handleInputChange}
                        min="256"
                        max="4096"
                        step="256"
                        className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* System Prompt */}
              <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
                <h2 className="text-xl font-bold mb-4">System Prompt</h2>
                <p className="text-sm text-gray-400 mb-4">
                  This defines how your chatbot behaves. Edit it to match your business needs.
                </p>
                <textarea
                  name="systemPrompt"
                  value={formData.systemPrompt}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-mono text-sm placeholder-gray-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-black rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Create Chatbot
                    </>
                  )}
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 border border-emerald-500/30 text-white rounded-lg font-semibold hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
              <h3 className="text-lg font-bold mb-4">Preview</h3>
              <div className="bg-black border border-emerald-500/20 rounded-lg p-4 h-64 flex flex-col">
                <div className="text-sm text-gray-400 mb-3">Bot Preview</div>
                <div className="flex-1 bg-white/5 rounded border border-emerald-500/10 p-3 text-sm text-gray-300 overflow-y-auto">
                  {formData.name ? (
                    <>
                      <div className="font-semibold text-emerald-400 mb-2">{formData.name}</div>
                      <div className="text-xs text-gray-400">{formData.description || 'No description'}</div>
                      <div className="mt-3 space-y-1 text-xs">
                        <div className="text-gray-500">Model: {formData.model}</div>
                        <div className="text-gray-500">Tone: {formData.tone}</div>
                        <div className="text-gray-500">Temp: {formData.temperature.toFixed(2)}</div>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500 text-center mt-20">Enter bot details to see preview</div>
                  )}
                </div>
              </div>
            </div>

            {/* Embed Code */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
              <h3 className="text-lg font-bold mb-4">Embed Code</h3>
              <p className="text-sm text-gray-400 mb-3">Copy this code to embed on your website</p>
              <div className="bg-black border border-emerald-500/20 rounded p-3 font-mono text-xs text-gray-300 overflow-x-auto mb-3 max-h-24">
                &lt;iframe src="https://kariaai.com/embed/bot-id" width="100%" height="600"&gt;&lt;/iframe&gt;
              </div>
              <button
                type="button"
                onClick={copyEmbedCode}
                className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Code
                  </>
                )}
              </button>
            </div>

            {/* Tips */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
              <h3 className="text-lg font-bold mb-4">Tips</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex gap-2">
                  <span className="text-emerald-400 flex-shrink-0">•</span>
                  <span>Use clear system prompts for better responses</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 flex-shrink-0">•</span>
                  <span>GPT-4 is best for complex tasks</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 flex-shrink-0">•</span>
                  <span>Lower temperature for consistency</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 flex-shrink-0">•</span>
                  <span>Test your bot before deploying</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
