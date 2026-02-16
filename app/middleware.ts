import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard'];
const authRoutes = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get auth token from cookie or could check localStorage on client
    const token = request.cookies.get('authToken')?.value;

    // Check if accessing a protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect to dashboard if accessing auth routes with valid token
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/auth/login',
        '/auth/register',
    ],
};
