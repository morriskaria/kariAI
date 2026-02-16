'use client';

import Link from 'next/link';
import { ArrowRight, Zap, MessageCircle, BarChart3, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">KariaAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm text-slate-600 hover:text-slate-900">
              Sign In
            </Link>
            <Link href="/auth/register" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <div className="space-y-6 text-center">
          <div className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
            🌍 Built for African Businesses
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight">
            Deploy AI Chatbots in <span className="text-teal-600">30 Minutes</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            KariaAI empowers African SMBs to automate customer interactions with AI-powered chatbots. No coding required. No expensive setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/register" className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#features" className="px-8 py-3 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors font-medium">
              Learn More
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 py-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-600">500+</div>
            <p className="text-slate-600 mt-2">Businesses Automated</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-600">2M+</div>
            <p className="text-slate-600 mt-2">Conversations Handled</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-600">40%</div>
            <p className="text-slate-600 mt-2">Cost Reduction Average</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose KariaAI?</h2>
            <p className="text-xl text-slate-600">Everything you need to deploy AI chatbots for your business</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="p-8 border border-slate-200 rounded-lg hover:border-teal-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">30-Minute Setup</h3>
              <p className="text-slate-600">Upload your business info, customize your chatbot, and deploy. No technical knowledge required.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-slate-200 rounded-lg hover:border-teal-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">24/7 Customer Support</h3>
              <p className="text-slate-600">Your AI receptionist handles customer questions, books appointments, and captures leads automatically.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-slate-200 rounded-lg hover:border-teal-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Real-Time Analytics</h3>
              <p className="text-slate-600">Track conversations, customer satisfaction, and chatbot performance with detailed dashboards.</p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 border border-slate-200 rounded-lg hover:border-teal-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Affordable Pricing</h3>
              <p className="text-slate-600">Pay only for what you use. Start free, scale as you grow. Pricing in KES, NGN, GHS, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Built for African Businesses</h2>
            <p className="text-xl text-slate-600">From clinics to law firms, e-commerce to real estate</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Clinics & Salons', desc: 'Automate appointment booking and FAQ responses' },
              { title: 'Law Firms', desc: 'Handle client inquiries and document requests 24/7' },
              { title: 'E-commerce', desc: 'Answer product questions and process orders automatically' },
              { title: 'Real Estate', desc: 'Qualify leads and schedule property viewings' },
            ].map((useCase, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-teal-50 to-slate-50 rounded-lg border border-teal-100">
                <h3 className="font-bold text-slate-900 mb-2">{useCase.title}</h3>
                <p className="text-slate-600 text-sm">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-teal-100 text-lg mb-8">Join 500+ African businesses automating customer interactions with KariaAI</p>
          <Link href="/auth/register" className="inline-block px-8 py-3 bg-white text-teal-600 rounded-lg hover:bg-slate-50 transition-colors font-bold">
            Start Your Free Trial Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-teal-400" />
                <span className="font-bold text-white">KariaAI</span>
              </div>
              <p className="text-sm">AI chatbots for African businesses</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 KariaAI. All rights reserved. Built with 🚀 for Africa.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
