
export function LogoTicker() {
    return (
        <section className="py-8 bg-black border-y border-white/5 overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto flex items-center justify-center gap-12 md:gap-24 opacity-50 grayscale mix-blend-screen">
                {/* Mock Logos - simple text/svg placeholders for now */}
                <div className="flex items-center gap-2 font-bold text-xl text-white"><span className="w-6 h-6 rounded-full bg-white/20"></span> Acme Corp</div>
                <div className="flex items-center gap-2 font-bold text-xl text-white"><span className="w-6 h-6 rounded-full bg-white/20"></span> Quantum</div>
                <div className="flex items-center gap-2 font-bold text-xl text-white"><span className="w-6 h-6 rounded-full bg-white/20"></span> Echo Valley</div>
                <div className="flex items-center gap-2 font-bold text-xl text-white"><span className="w-6 h-6 rounded-full bg-white/20"></span> Pulse</div>
                <div className="hidden md:flex items-center gap-2 font-bold text-xl text-white"><span className="w-6 h-6 rounded-full bg-white/20"></span> Outside</div>
            </div>
        </section>
    )
}
