'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Verification token is missing');
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await apiClient.verifyEmail(token);
                setStatus('success');
                setMessage(response.data.message || 'Email verified successfully!');

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000);
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
            }
        };

        verifyEmail();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-2xl text-slate-900">KariaAI</span>
                </div>

                {/* Card */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center">
                        {status === 'loading' && (
                            <>
                                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                                    <Loader2 className="w-16 h-16 text-teal-600 animate-spin" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">Verifying Your Email</h1>
                                <p className="text-slate-600">Please wait while we verify your email address...</p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">Email Verified! 🎉</h1>
                                <p className="text-slate-600 mb-6">{message}</p>
                                <p className="text-sm text-slate-500">Redirecting you to login...</p>

                                <Link
                                    href="/auth/login"
                                    className="inline-block mt-6 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                                >
                                    Go to Login
                                </Link>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                                    <XCircle className="w-10 h-10 text-red-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h1>
                                <p className="text-slate-600 mb-6">{message}</p>

                                <div className="space-y-3">
                                    <Link
                                        href="/auth/login"
                                        className="block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                                    >
                                        Go to Login
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        className="block px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                    >
                                        Create New Account
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-slate-600 mt-6">
                    Need help? Contact{' '}
                    <a href="mailto:support@kariaai.com" className="text-teal-600 hover:text-teal-700">
                        support@kariaai.com
                    </a>
                </p>
            </div>
        </div>
    );
}
