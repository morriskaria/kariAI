import Link from "next/link"
import { Zap } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-black py-12 border-t border-white/10">
            <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <img src="/main logo.png" alt="KariAI Logo" className="h-8 w-auto object-contain" />
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                    <Link href="#" className="hover:text-white transition-colors">Home</Link>
                    <Link href="#" className="hover:text-white transition-colors">All Pages</Link>
                    <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="#" className="hover:text-white transition-colors">Blog</Link>
                    <Link href="#" className="hover:text-white transition-colors">Contact</Link>
                </div>

                <div className="text-sm text-gray-500">
                    &copy; 2026 KariaAI. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
