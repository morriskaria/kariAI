import { Button } from "../ui/button"

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-24 pb-32 md:pt-32">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-30" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container px-4 md:px-6 mx-auto text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-primary mb-8 animate-fade-in-up">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                    We raised $1M as pre-seed fund
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] mx-auto max-w-4xl">
                    The AI SaaS your <br />
                    <span className="text-white">product needs</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Our AI SaaS solution enhances your product with advanced artificial intelligence, streamlining operations and driving efficiency and innovation.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Button size="lg" className="h-12 px-8 text-base shadow-[0_0_30px_rgba(0,212,85,0.4)]">
                        Get Template
                    </Button>
                    <Button size="lg" variant="secondary" className="h-12 px-8 text-base bg-white/5 hover:bg-white/10 text-white border border-white/10">
                        Learn More
                    </Button>
                </div>

                {/* Dashboard Preview Mockup */}
                <div className="relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-4 shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent z-10" />

                    {/* Mock UI Structure */}
                    <div className="rounded-lg bg-[#0A0A0A] border border-white/5 overflow-hidden aspect-[16/9] relative">
                        {/* Header */}
                        <div className="h-12 border-b border-white/5 flex items-center px-4 gap-4">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                            <div className="ml-8 w-64 h-2 rounded-full bg-white/5" />
                        </div>

                        {/* Body */}
                        <div className="p-6 grid grid-cols-4 gap-6 h-full">
                            {/* Sidebar */}
                            <div className="col-span-1 border-r border-white/5 pr-6 space-y-4">
                                <div className="h-2 w-1/2 bg-white/10 rounded" />
                                <div className="space-y-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-8 w-full bg-white/5 rounded" />
                                    ))}
                                </div>
                            </div>
                            {/* Content */}
                            <div className="col-span-3 grid grid-cols-2 gap-4">
                                <div className="h-32 rounded-lg bg-white/5 border border-white/5" />
                                <div className="h-32 rounded-lg bg-white/5 border border-white/5" />
                                <div className="h-32 rounded-lg bg-white/5 border border-white/5" />
                                <div className="h-32 rounded-lg bg-white/5 border border-white/5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
