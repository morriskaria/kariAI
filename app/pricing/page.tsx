'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: 'KES 2,500',
      priceUSD: '$20',
      description: 'Perfect for small businesses just getting started',
      features: [
        '1 Chatbot',
        '500 conversations/month',
        'Basic analytics',
        'Email support',
        'Website embed',
        'Standard response time',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      price: 'KES 7,500',
      priceUSD: '$60',
      description: 'For growing businesses with higher demand',
      features: [
        '5 Chatbots',
        '5,000 conversations/month',
        'Advanced analytics',
        'Priority support',
        'Custom branding',
        'Fast response time',
        'API access',
        'Multi-language support',
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      priceUSD: 'Contact us',
      description: 'Tailored solutions for large organizations',
      features: [
        'Unlimited chatbots',
        'Unlimited conversations',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantees',
        'On-premise deployment',
        'Advanced security',
        'Training & onboarding',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Simple, Transparent
            <span className="block mt-2 bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan for your business. Pay-as-you-go with local currency support.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`glass-panel rounded-2xl p-8 ${
                  plan.popular
                    ? 'ring-2 ring-primary shadow-[0_0_40px_rgba(0,212,85,0.3)]'
                    : ''
                } relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-black px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{plan.priceUSD}/month</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full h-12 rounded-full font-semibold transition-all ${
                    plan.popular
                      ? 'bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(0,212,85,0.4)]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I change plans later?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept M-Pesa, card payments, and bank transfers in local currencies (KES, NGN, GHS).',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! All plans come with a 14-day free trial. No credit card required.',
              },
              {
                q: 'What happens if I exceed my conversation limit?',
                a: 'We\'ll notify you when you\'re approaching your limit. You can upgrade or purchase additional conversations.',
              },
            ].map((faq, index) => (
              <div key={index} className="glass-panel rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
