'use client';

import Link from 'next/link';
import { Zap, Mail, CheckCircle } from 'lucide-react';

export default function VerificationSentPage() {
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
                        <div className="w-16 h-16 mx-auto mb-6 bg-teal-100 rounded-full flex items-center justify-center">
                            <Mail className="w-10 h-10 text-teal-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Check Your Email! 📧</h1>
                        <p className="text-slate-600 mb-6">
                            We've sent a verification link to your email  address. Click the link in the email to verify your account.
                        </p>

                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                                <div className="text-left text-sm">
                                    <p className="font-medium text-teal-900 mb-1">Next Steps:</p>
                                    <ol className="text-teal-700 space-y-1 list-decimal list-inside">
                                        <li>Check your inbox (and spam folder)</li>
                                        <li>Click the verification link</li>
                                        <li>Sign in to your account</li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500 mb-4">
                            The verification link will expire in <strong>24 hours</strong>.
                        </p>

                        <div className="space-y-3">
                            <Link
                                href="/auth/login"
                                className="block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                            >
                                Go to Login
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Resend Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-6 text-center">
                    <p className="text-sm text-slate-600">
                        Didn't receive the email?{' '}
                        <Link href="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">
                            Sign in
                        </Link>{' '}
                        to resend
                    </p>
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
