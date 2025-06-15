"use client";

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

function AuthContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const [isSignIn, setIsSignIn] = useState(mode !== 'signup');
    const { data: session, status } = useSession();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push('/dashboard');
        }
    }, [session, router]);

    useEffect(() => {
        setIsSignIn(mode !== 'signup');
    }, [mode]);

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleForm = () => {
        setIsSignIn(!isSignIn);
        setError('');
        setSuccess('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to register');
            }

            setSuccess('Registration successful! You can now sign in.');
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            setIsSignIn(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            // on successful login
            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to sign in');
        } finally {
            setIsLoading(false);
        }
    };

    const PasswordResetInfoBox = () => (
        <div className="mt-8 p-3 bg-blue-50 border border-blue-200 flex items-start">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_354_3517)">
                    <path d="M22 9V7H21V5H20V4H19V3H17V2H15V1H9V2H7V3H5V4H4V5H3V7H2V9H1V15H2V17H3V19H4V20H5V21H7V22H9V23H15V22H17V21H19V20H20V19H21V17H22V15H23V9H22ZM11 6H13V8H11V6ZM10 15H11V10H10V9H13V15H14V17H10V15Z" fill="#2B7FFF" />
                </g>
                <defs>
                    <clipPath id="clip0_354_3517">
                        <rect width="24" height="24" fill="white" />
                    </clipPath>
                </defs>
            </svg>
            <p className="text-sm text-blue-700 pl-4">
                I&apos;m too lazy to implement password reset, so just remember it bro!
            </p>
        </div>
    );

    return (
        <>
            <nav className="bg-white border-b-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-24">
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 flex items-center gap-4">
                                <Image
                                    src="/heart.svg"
                                    width={30}
                                    height={30}
                                    alt="Heart Logo"
                                />
                                <span className="text-3xl font-bold font-playfair text-black">Office of Girlfriend Affairs</span>
                            </Link>
                        </div>

                        <div className="hidden sm:flex items-center">
                            <Link
                                href="/"
                                className="py-2 px-6 bg-red-200 flex items-center gap-4 font-lexend hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] text-xl border-2 transition duration-300"
                            >
                                Back to Home
                            </Link>
                        </div>

                        <div className="sm:hidden flex items-center">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                onClick={toggleMenu}
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    {menuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {menuOpen && (
                    <div className="sm:hidden">
                        <div className="pt-2 pb-3 space-y-1 px-4">
                            <Link
                                href="/"
                                className="py-2 px-6 flex items-center gap-4 bg-red-200 font-lexend hover:bg-red-100 text-2xl border-2 transition duration-300"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                )}
            </nav >

            <main className="flex justify-center items-start">
                <div className="w-full px-4 sm:px-6 md:w-3/4 lg:w-1/2 xl:w-2/5 max-w-md mx-auto bg-white mt-8 sm:mt-28">
                    <div className="mb-6">
                        <h1 className="text-4xl sm:text-6xl font-bold text-red-400 text-center font-playfair">
                            {isSignIn ? 'Sign In' : 'Sign Up'}
                        </h1>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                            {success}
                        </div>
                    )}

                    {isSignIn ? (
                        <>
                            {/* sign in form */}
                            <form className="space-y-4" onSubmit={handleSignIn}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-red-200 font-medium transition duration-300 border-2 shadow-[5px_5px_0px_0px_rgba(0,0,0)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </form>

                            <PasswordResetInfoBox />
                        </>
                    ) : (
                        <>
                            {/* sign up form */}
                            <form className="space-y-4" onSubmit={handleSignUp}>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-red-200 font-medium transition duration-300 border-2 shadow-[5px_5px_0px_0px_rgba(0,0,0)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                                </button>
                            </form>

                            <PasswordResetInfoBox />
                        </>
                    )}

                    <div className="mt-4 text-center">
                        <button
                            onClick={toggleForm}
                            className="text-red-600 hover:text-red-800 font-medium"
                        >
                            {isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}

function AuthLoading() {
    return <div className="min-h-screen flex items-center justify-center">Loading auth page...</div>;
}

export default function Auth() {
    return (
        <Suspense fallback={<AuthLoading />}>
            <AuthContent />
        </Suspense>
    );
}