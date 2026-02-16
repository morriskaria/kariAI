'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { MessageCircle, Zap, Globe, BarChart3, Lock, Puzzle } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: Zap,
      title: '30-Minute Setup',
      description: 'Deploy a fully functional AI chatbot without any coding. Get started in minutes, not days.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: MessageCircle,
      title: '24/7 Customer Support',
      description: 'AI receptionist handles inquiries, books appointments, and captures leads around the clock.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track conversations, customer satisfaction, and bot performance with detailed insights.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Support for Swahili, English, Amharic, Yoruba, and more African languages.',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: Lock,
      title: 'Secure & Compliant',
      description: 'GDPR-ready, HIPAA-compliant with SOC2 Type II certification path.',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Puzzle,
      title: 'Easy Integration',
      description: 'Embed code snippet on any website in seconds. Works with all platforms.',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Powerful Features for
            <span className="block mt-2 bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
              Modern Businesses
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Everything you need to automate customer interactions and grow your business with AI-powered chatbots.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-panel rounded-2xl p-8 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of businesses already using KariaAI to transform their customer service.
          </p>
          <button className="h-12 px-8 rounded-full bg-primary text-black font-semibold hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(0,212,85,0.4)]">
            Start Free Trial
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
