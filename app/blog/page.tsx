'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    {
      title: 'How AI Chatbots are Transforming African Businesses',
      excerpt: 'Discover how small and medium businesses across Africa are leveraging AI to compete globally and improve customer service.',
      date: '2026-02-10',
      readTime: '5 min read',
      category: 'AI Insights',
      image: '/blog-1.jpg',
    },
    {
      title: '5 Ways to Optimize Your Chatbot for Better Customer Engagement',
      excerpt: 'Learn proven strategies to make your AI chatbot more effective at capturing leads and satisfying customers.',
      date: '2026-02-05',
      readTime: '7 min read',
      category: 'Best Practices',
      image: '/blog-2.jpg',
    },
    {
      title: 'The Future of Customer Service in Africa',
      excerpt: 'Exploring how AI technology is bridging the gap between businesses and customers across the continent.',
      date: '2026-01-28',
      readTime: '6 min read',
      category: 'Industry Trends',
      image: '/blog-3.jpg',
    },
    {
      title: 'Case Study: How a Kenyan Clinic Increased Appointments by 200%',
      excerpt: 'Real-world success story of a healthcare provider using KariaAI to automate appointment bookings.',
      date: '2026-01-20',
      readTime: '8 min read',
      category: 'Case Studies',
      image: '/blog-4.jpg',
    },
    {
      title: 'Multi-Language Support: Reaching More Customers',
      excerpt: 'Why supporting local languages is crucial for customer engagement in African markets.',
      date: '2026-01-15',
      readTime: '4 min read',
      category: 'Features',
      image: '/blog-5.jpg',
    },
    {
      title: 'Security and Compliance: What You Need to Know',
      excerpt: 'Understanding GDPR, HIPAA, and data protection when implementing AI chatbots.',
      date: '2026-01-10',
      readTime: '6 min read',
      category: 'Security',
      image: '/blog-6.jpg',
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Insights &
            <span className="block mt-2 bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
              Resources
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Stay updated with the latest trends, tips, and success stories in AI-powered customer service.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article
                key={index}
                className="glass-panel rounded-2xl overflow-hidden hover:bg-white/5 transition-all duration-300 group cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-green-500/20 flex items-center justify-center">
                  <div className="text-6xl opacity-20">📝</div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-400 mb-8">
            Get the latest insights and updates delivered to your inbox weekly.
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-gray-500"
            />
            <button className="px-6 py-3 rounded-full bg-primary text-black font-semibold hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(0,212,85,0.4)]">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
