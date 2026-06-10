'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Input, Button, Link } from '@heroui/react';
import { authClient } from '@/lib/auth-client';

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate inputs
            if (!email || !password) {
                setError('Please fill in all fields');
                setLoading(false);
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError('Please enter a valid email address');
                setLoading(false);
                return;
            }

            // Attempt sign in
            const response = await authClient.signIn.email({
                email,
                password,
            });

            if (response.error) {
                setError(response.error.message || 'Failed to sign in');
            } else {
                // Redirect to dashboard or home page on success
                router.push('/');
            }
        } catch (err) {
            setError(err?.message || String(err) || 'An error occurred during sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-800 border border-slate-700 p-8">
                <div className="flex flex-col items-center justify-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400 text-center">Sign in to your account to continue</p>
                </div>
                
                <div className="mb-8 border-t border-slate-700" />
                
                <div className="gap-6 space-y-6">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="bg-slate-700"
                            classNames={{
                                input: 'bg-slate-700 text-white',
                                label: 'text-slate-300',
                            }}
                        />

                        <Input
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="bg-slate-700"
                            classNames={{
                                input: 'bg-slate-700 text-white',
                                label: 'text-slate-300',
                            }}
                            endContent={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-slate-400 hover:text-slate-200"
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            }
                        />

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-6 mt-6 hover:bg-blue-700 transition"
                            disabled={loading}
                            isLoading={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="text-center text-slate-400 text-sm">
                        Do not have an account?{' '}
                        <Link
                            href="/auth/signup"
                            className="text-blue-500 hover:text-blue-400 font-semibold"
                        >
                            Sign up here
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}