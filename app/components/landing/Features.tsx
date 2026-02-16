import { CheckCircle2 } from "lucide-react"

export function Features() {
    return (
        <section className="py-24 bg-black relative">
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />

            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-white">Access to the future of work</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Experience AI-driven features: intelligent automation, seamless integration, and real-time insights.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
                    {/* Card 1: Large Green - Scalability */}
                    <div className="col-span-1 md:col-span-3 row-span-2 relative overflow-hidden rounded-3xl bg-primary/10 border border-primary/20 p-8 flex flex-col justify-end group hover:border-primary/40 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/20" />
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <div className="grid grid-cols-3 gap-2">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="w-12 h-12 bg-white rounded-lg" />
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs text-primary font-medium">
                                Scalability
                            </div>
                            <h3 className="text-2xl font-bold text-primary-foreground/90">Build Scalable product with the help of our AI</h3>
                            <p className="text-sm text-primary-foreground/70 max-w-sm">
                                Easily scale your resources up or down based on business needs without hardware limitations.
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Image/Video Placeholder */}
                    <div className="col-span-1 md:col-span-3 row-span-1 relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/10">
                        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                            {/* Simulated Image */}
                            <div className="w-full h-full bg-zinc-800 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/40 backdrop-blur rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-500" />
                                <div className="text-xs text-white">
                                    <div className="font-bold">AI Assistant</div>
                                    <div className="text-gray-400">Online</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Subscription Success (Small) */}
                    <div className="col-span-1 md:col-span-2 row-span-1 rounded-3xl bg-zinc-900 border border-white/10 p-6 flex flex-col justify-between hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Subscription Successful</div>
                                <div className="text-xs text-gray-400">Today, 09:24</div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm font-bold text-white">Cost-effectiveness</div>
                            <div className="text-xs text-gray-400">Reduce upfront costs with subscription-based models.</div>
                        </div>
                    </div>

                    {/* Card 4: Chart (Small) */}
                    <div className="col-span-1 md:col-span-2 row-span-1 rounded-3xl bg-zinc-900 border border-white/10 p-6 flex flex-col justify-between hover:border-white/20 transition-colors">
                        <div className="h-24 flex items-end justify-between gap-2 px-2 pb-2">
                            {[40, 70, 45, 90, 60, 80, 50, 85].map((h, i) => (
                                <div key={i} className="w-full bg-primary/20 rounded-t-sm" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                        <div className="flex items-baseline justify-between">
                            <div className="text-3xl font-bold text-white">90%</div>
                            <div className="text-xs text-primary font-medium">+12.5%</div>
                        </div>
                    </div>

                    {/* Card 5: Users/Analytics (Medium Green) */}
                    <div className="col-span-1 md:col-span-2 row-span-1 rounded-3xl bg-primary/5 border border-primary/20 p-6 flex flex-col justify-between hover:border-primary/40 transition-colors">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800" />
                            ))}
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-white">Analytics and Insights</h3>
                            <p className="text-xs text-gray-400">
                                Gain valuable insights through built-in analytics tools.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
