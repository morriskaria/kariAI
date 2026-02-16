'use client';

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { useAuthStore } from "@/lib/auth-store"

export function Navbar() {
    const router = useRouter();
    const { user } = useAuthStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="container px-4 md:px-6 mx-auto h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/main logo.png" alt="KariAI Logo" className="h-24 w-auto object-contain" />
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="/" className="text-white hover:text-primary transition-colors">
                        Home
                    </Link>
                    <Link href="/features" className="hover:text-primary transition-colors">
                        Features
                    </Link>
                    <Link href="/pricing" className="hover:text-primary transition-colors">
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
                    {user ? (
                        <Button 
                            onClick={() => router.push('/dashboard')}
                            className="font-semibold shadow-[0_0_20px_rgba(0,212,85,0.3)] hover:shadow-[0_0_25px_rgba(0,212,85,0.5)] transition-shadow"
                        >
                            Dashboard
                        </Button>
                    ) : (
                        <>
                            <Button 
                                variant="ghost" 
                                onClick={() => router.push('/auth/login')}
                                className="hidden sm:inline-flex text-white hover:text-white hover:bg-white/10"
                            >
                                Sign In
                            </Button>
                            <Button 
                                onClick={() => router.push('/auth/register')}
                                className="font-semibold shadow-[0_0_20px_rgba(0,212,85,0.3)] hover:shadow-[0_0_25px_rgba(0,212,85,0.5)] transition-shadow"
                            >
                                Get Started
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
