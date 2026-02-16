'use client';

import { Inter } from 'next/font/google';
import Link from 'next/link';

// Configure Inter font locally
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

// Custom color constants
const COLORS = {
    primary: '#08CB00',
    backgroundLight: '#f6f8f8',
    backgroundDark: '#12201f',
};

export default function FeatureDetailsPage() {
    return (
        <div className={`${inter.variable} font-sans bg-[#f6f8f8] dark:bg-[#12201f] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col`}>
            {/* Self-contained styles for glass effect and gradient */}
            <style jsx global>{`
        .glass-card {
            background: rgba(27, 49, 47, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(8, 203, 0, 0.1);
        }
        .hero-gradient {
            background: radial-gradient(circle at 50% 50%, rgba(8, 203, 0, 0.15) 0%, rgba(18, 32, 31, 0) 70%);
        }
        /* Ensure dark mode class on html applies correctly */
        :root {
            color-scheme: dark light;
        }
      `}</style>

            {/* Material Icons Link */}
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </head>

            {/* Sticky Header */}
            <header className="sticky top-0 z-50 flex items-center bg-[#f6f8f8]/80 dark:bg-[#12201f]/80 backdrop-blur-md p-4 justify-between border-b border-[#08CB00]/10">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#08CB00] text-3xl">token</span>
                    <h2 className="text-lg font-bold leading-tight tracking-tight">KariaAI</h2>
                </div>
                <button className="bg-[#08CB00]/20 text-[#08CB00] px-4 py-1.5 rounded-full text-sm font-bold border border-[#08CB00]/30 transition-colors hover:bg-[#08CB00]/30">
                    Get Started
                </button>
            </header>

            <main className="flex-1 overflow-y-auto pb-24">
                {/* Hero Section */}
                <section className="relative px-6 pt-12 pb-8 text-center hero-gradient">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#08CB00]/10 border border-[#08CB00]/20 text-[#08CB00] text-xs font-bold mb-4 tracking-wider uppercase">
                        Advanced Capabilities
                    </div>
                    <h1 className="text-4xl font-black leading-[1.1] tracking-tight mb-4">
                        Everything Your Business Needs to <span className="text-[#08CB00]">Scale</span>
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed max-w-xs mx-auto mb-8">
                        Unlock the full potential of AI-powered automation to streamline operations and enhance customer engagement.
                    </p>
                </section>

                {/* Feature Detail Sections */}
                <section className="px-4 py-8 space-y-6">
                    {/* Feature 1: Smart Call Routing */}
                    <div className="glass-card p-6 rounded-xl flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#08CB00]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#08CB00] text-3xl">call_split</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2">Smart Call Routing</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                Intelligent call distribution ensures customers reach the right department instantly. Minimize wait times and improve satisfaction.
                            </p>
                            <ul className="space-y-2 mb-4">
                                <li className="flex items-start gap-2 text-slate-300 text-sm">
                                    <span className="material-symbols-outlined text-[#08CB00] text-sm mt-0.5">check_circle</span>
                                    <span>Redirect based on caller intent</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300 text-sm">
                                    <span className="material-symbols-outlined text-[#08CB00] text-sm mt-0.5">check_circle</span>
                                    <span>Multi-level IVR menus</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300 text-sm">
                                    <span className="material-symbols-outlined text-[#08CB00] text-sm mt-0.5">check_circle</span>
                                    <span>Priority handling for VIPs</span>
                                </li>
                            </ul>
                            <a href="#" className="text-[#08CB00] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                Learn more <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </a>
                        </div>
                    </div>

                    {/* Feature 2: CRM Synchronization */}
                    <div className="glass-card p-6 rounded-xl flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#08CB00]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#08CB00] text-3xl">sync_alt</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2">CRM Synchronization</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                Seamlessly integrate with your existing CRM to keep customer data up-to-date automatically. No manual data entry required.
                            </p>
                            <ul className="space-y-2 mb-4">
                                <li className="flex items-start gap-2 text-slate-300 text-sm">
                                    <span className="material-symbols-outlined text-[#08CB00] text-sm mt-0.5">check_circle</span>
                                    <span>Real-time data updates</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300 text-sm">
                                    <span className="material-symbols-outlined text-[#08CB00] text-sm mt-0.5">check_circle</span>
                                    <span>Compatible with Salesforce, HubSpot, etc.</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300 text-sm">
                                    <span className="material-symbols-outlined text-[#08CB00] text-sm mt-0.5">check_circle</span>
                                    <span>Automated lead capture</span>
                                </li>
                            </ul>
                            <a href="#" className="text-[#08CB00] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                View integrations <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </a>
                        </div>
                    </div>

                    {/* Feature 3: AI Call Analytics */}
                    <div className="glass-card p-6 rounded-xl flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#08CB00]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#08CB00] text-3xl">analytics</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2">AI Call Analytics</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                Gain deep insights into customer interactions with AI-driven analytics. Optimize performance based on data, not guesswork.
                            </p>
                            <ul className="space-y-2 mb-4">
                                <li className="flex items-start gap-2 text-slate-300 text-sm">
                                    <span className="material-symbols-outlined text-[#08CB00] text-sm mt-0.5">check_circle</span>
                                    <span>Sentiment analysis</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300 text-sm">
                                    <span className="material-symbols-outlined text-[#08CB00] text-sm mt-0.5">check_circle</span>
                                    <span>Call volume trends</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300 text-sm">
                                    <span className="material-symbols-outlined text-[#08CB00] text-sm mt-0.5">check_circle</span>
                                    <span>Performance metrics dashboard</span>
                                </li>
                            </ul>
                            <a href="#" className="text-[#08CB00] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                See dashboard demo <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </a>
                        </div>
                    </div>

                    {/* Feature 4: Workflow Automation */}
                    <div className="glass-card p-6 rounded-xl flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#08CB00]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#08CB00] text-3xl">settings_suggest</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2">Workflow Automation</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                Automate repetitive tasks and complex workflows. Free up your team to focus on high-value activities.
                            </p>
                            <ul className="space-y-2 mb-4">
                                <li className="flex items-start gap-2 text-slate-300 text-sm">
                                    <span className="material-symbols-outlined text-[#08CB00] text-sm mt-0.5">check_circle</span>
                                    <span>Custom trigger actions</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300 text-sm">
                                    <span className="material-symbols-outlined text-[#08CB00] text-sm mt-0.5">check_circle</span>
                                    <span>Appointment scheduling</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300 text-sm">
                                    <span className="material-symbols-outlined text-[#08CB00] text-sm mt-0.5">check_circle</span>
                                    <span>Follow-up automation</span>
                                </li>
                            </ul>
                            <a href="#" className="text-[#08CB00] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                Explore workflows <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Comparison Section */}
                <section className="px-4 py-8">
                    <h3 className="text-xl font-bold mb-6 px-2 text-center">Comparison</h3>
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="grid grid-cols-2 bg-[#08CB00]/10 border-b border-[#08CB00]/10">
                            <div className="p-4 text-center font-bold text-[#08CB00]">KariaAI</div>
                            <div className="p-4 text-center font-bold text-slate-400">Traditional</div>
                        </div>
                        <div className="divide-y divide-[#08CB00]/10">
                            <div className="grid grid-cols-2">
                                <div className="p-4 text-center text-sm">24/7 Availability</div>
                                <div className="p-4 text-center text-sm text-slate-500">Business Hours</div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="p-4 text-center text-sm">Instant Response</div>
                                <div className="p-4 text-center text-sm text-slate-500">Wait Times</div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="p-4 text-center text-sm">Multi-Language</div>
                                <div className="p-4 text-center text-sm text-slate-500">Single Language</div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="p-4 text-center text-sm">Scalable Cost</div>
                                <div className="p-4 text-center text-sm text-slate-500">Fixed Salary</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call To Action Section */}
                <section className="mt-8 px-6 pb-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
                    <Link href="/auth/register" className="inline-block w-full max-w-xs bg-[#08CB00] text-[#12201f] py-4 rounded-xl font-bold text-base shadow-lg shadow-[#08CB00]/20 hover:bg-[#08CB00]/90 transition-all mb-4">
                        Start Free Trial
                    </Link>
                    <Link href="#" className="block text-slate-400 text-sm hover:text-[#08CB00] transition-colors">
                        Contact Sales
                    </Link>
                </section>

            </main>

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#08CB00]/10 bg-[#12201f] px-4 pb-6 pt-3 flex justify-between items-center">
                <Link href="/" className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#08CB00] transition-colors">
                    <span className="material-symbols-outlined text-2xl">home</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider">Home</span>
                </Link>
                <Link href="/features" className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#08CB00] transition-colors">
                    <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider">Features</span>
                </Link>
                <Link href="#" className="flex flex-col items-center gap-1 text-[#08CB00]">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>list_alt</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider">Details</span>
                </Link>
                <Link href="/dashboard/settings" className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#08CB00] transition-colors">
                    <span className="material-symbols-outlined text-2xl">settings</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider">Settings</span>
                </Link>
            </nav>
        </div>
    );
}
