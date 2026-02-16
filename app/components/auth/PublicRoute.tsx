'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
}

/**
 * PublicRoute wrapper for pages that should be accessible without authentication
 * If redirectIfAuthenticated is true, logged-in users will be redirected to dashboard
 */
export function PublicRoute({ children, redirectIfAuthenticated = false }: PublicRouteProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (redirectIfAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [user, router, redirectIfAuthenticated]);

  return <>{children}</>;
}
