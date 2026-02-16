'use client';

import { useRouter } from "next/navigation";
import { Navbar } from "./components/landing/Navbar"
import { Hero } from "./components/landing/Hero"
import { LogoTicker } from "./components/landing/LogoTicker"
import { Features } from "./components/landing/Features"
import { Footer } from "./components/landing/Footer"

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary/30">
      <Navbar />
      <Hero />
      <LogoTicker />
      <Features />

      {/* CTA Section */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="container px-4 md:px-6 mx-auto text-center max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to transform your business?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of businesses already using our AI solutions to grow and scale.
          </p>
          <button 
            onClick={() => router.push('/auth/register')}
            className="h-12 px-8 rounded-full bg-primary text-black font-semibold hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(0,212,85,0.4)]"
          >
            Get Started Now
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
