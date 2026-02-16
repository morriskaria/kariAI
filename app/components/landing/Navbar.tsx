import Link from "next/link"
import Image from "next/image"
import { Button } from "../ui/button"

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="container px-4 md:px-6 mx-auto h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/main logo.png" alt="KariAI Logo" width={100} height={100} className="h-8 w-auto object-contain" />
                    {/* <span className="text-lg font-bold tracking-tight text-white">
                        Index
                    </span> */}
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="/" className="text-white hover:text-primary transition-colors">
                        Home
                    </Link>
                    <Link href="#features" className="hover:text-primary transition-colors">
                        Features
                    </Link>
                    <Link href="#pricing" className="hover:text-primary transition-colors">
                        Pricing
                    </Link>
                    <Link href="/blog" className="hover:text-primary transition-colors">
                        Blog
                    </Link>
                    <Link href="/contact" className="hover:text-primary transition-colors">
                        Contact
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="hidden sm:inline-flex text-white hover:text-white hover:bg-white/10">
                        Sign In
                    </Button>
                    <Button className="font-semibold shadow-[0_0_20px_rgba(0,212,85,0.3)] hover:shadow-[0_0_25px_rgba(0,212,85,0.5)] transition-shadow">
                        Get Template
                    </Button>
                </div>
            </div>
        </header>
    )
}
