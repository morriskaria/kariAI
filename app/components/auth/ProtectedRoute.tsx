'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, setUser, setLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // If we have a token but no user, try to decode it (simplified version)
        // In production, you'd validate with the backend
        if (!user && token) {
          // For now, we'll just redirect to login if there's no user
          // In production, implement a /auth/me endpoint to validate the token
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('[v0] Auth check failed:', error);
        router.push('/auth/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [user, router, setUser, setLoading]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-teal-600 rounded-full"></div>
          </div>
          <p className="text-slate-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
