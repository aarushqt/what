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
        username: '',
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
        return <div className="min-h-screen w-full flex items-center justify-center">
            <Image
                src="/heart.svg"
                width={100}
                height={100}
                alt="Heart Logo"
                className="animate-heartbeat"
            />
        </div>;
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
                    username: formData.username,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to register');
            }

            setSuccess('Registration successful! You can now sign in.');
            setFormData({ name: '', username: '', password: '', confirmPassword: '' });
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
                username: formData.username,
                password: formData.password,
            });

            if (result?.error) {
                setError("Something's not right, recheck everything.");
                return;
            }

            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to sign in');
        } finally {
            setIsLoading(false);
        }
    };

    const PasswordResetInfoBox = () => (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 flex items-start">
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
                I&apos;m too lazy to implement password reset, so for your sake and mine, remember it!
            </p>
        </div>
    );

    return (
        <>
            <nav className="border-b-2">
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
                                className="inline-flex items-center justify-center p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
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
                <div className="w-full px-4 sm:px-6 md:w-3/4 lg:w-1/2 xl:w-2/5 max-w-md mx-auto mt-8 sm:mt-28 font-lexend">
                    <div className="mb-6">
                        <h1 className="text-4xl sm:text-6xl font-bold text-red-400 text-center font-playfair">
                            {isSignIn ? 'Sign In' : 'Sign Up'}
                        </h1>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 flex items-center gap-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6 4H20V6H22V8V10V12H14V14H20V16H16V18H14V20H2V18V16V14V12V10V8H4V6H6V4ZM8 10H10V8H8V10Z" fill="#C10007" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700">
                            {success}
                        </div>
                    )}

                    {isSignIn ? (
                        <>
                            {/* sign in form */}
                            <form className="space-y-4" onSubmit={handleSignIn}>
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                        Username
                                    </label>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M15 2H9V3.99994H7.00024V9.99994H9.00024V4H15V2ZM15 10H9V12H15V10ZM15.0002 3.99994H17.0002V9.99994H15.0002V3.99994ZM4 15.9999H6V14H18V16H6V20H18.0002V15.9999H20.0002V21.9999H20V22H4V21.9999V20V15.9999Z" fill="black" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="username"
                                            value={formData.username}
                                            placeholder='Your unique username'
                                            onChange={handleInputChange}
                                            className="w-full pl-12 px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M0 7H2V9H0V7ZM4 11H2V9H4V11ZM8 13V11H4V13H2V15H4V13H8ZM16 13H8V15H6V17H8V15H16V17H18V15H16V13ZM20 11H16V13H20V15H22V13H20V11ZM22 9V11H20V9H22ZM22 9V7H24V9H22Z" fill="black" />
                                            </svg>
                                        </div>
                                        <input
                                            type="password"
                                            id="password"
                                            value={formData.password}
                                            placeholder='Your secret password'
                                            onChange={handleInputChange}
                                            className="w-full pl-12 px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-red-200 font-medium transition duration-300 border-2 shadow-[5px_5px_0px_0px_rgba(0,0,0)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg width="24" height="24" className='animate-spin' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.9999 2H10.9999V8H12.9999V2ZM12.9999 16H10.9999V22H12.9999V16ZM21.9998 11V13L15.9998 13V11H21.9998ZM7.99963 13V11H1.99963V13L7.99963 13ZM14.9996 6.99997H16.9996V8.99997H14.9996V6.99997ZM18.9995 4.99997H16.9995V6.99997H18.9995V4.99997ZM8.99963 6.99997H6.99963V8.99997H8.99963V6.99997ZM4.99973 4.99997H6.99973V6.99997H4.99973V4.99997ZM14.9996 17H16.9995V18.9999H18.9995V16.9999H16.9996V15H14.9996V17ZM6.99963 16.9999V15H8.99963V17H6.99973V18.9999H4.99973V16.9999H6.99963Z" fill="black" />
                                            </svg>
                                            <span>Signing In...</span>
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </form>

                        </>
                    ) : (
                        <>
                            {/* sign up form */}
                            <form className="space-y-4" onSubmit={handleSignUp}>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M15 2H9V3.99994H7.00024V9.99994H9.00024V4H15V2ZM15 10H9V12H15V10ZM15.0002 3.99994H17.0002V9.99994H15.0002V3.99994ZM4 15.9999H6V14H18V16H6V20H18.0002V15.9999H20.0002V21.9999H20V22H4V21.9999V20V15.9999Z" fill="black" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            placeholder='LoverBoy McHandsome'
                                            onChange={handleInputChange}
                                            className="w-full pl-12 px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M15 2H9V3.99994H7.00024V9.99994H9.00024V4H15V2ZM15 10H9V12H15V10ZM15.0002 3.99994H17.0002V9.99994H15.0002V3.99994ZM4 15.9999H6V14H18V16H6V20H18.0002V15.9999H20.0002V21.9999H20V22H4V21.9999V20V15.9999Z" fill="black" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="username"
                                            value={formData.username}
                                            placeholder='Your username'
                                            onChange={handleInputChange}
                                            className="w-full pl-12 px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M0 7H2V9H0V7ZM4 11H2V9H4V11ZM8 13V11H4V13H2V15H4V13H8ZM16 13H8V15H6V17H8V15H16V17H18V15H16V13ZM20 11H16V13H20V15H22V13H20V11ZM22 9V11H20V9H22ZM22 9V7H24V9H22Z" fill="black" />
                                            </svg>
                                        </div>
                                        <input
                                            type="password"
                                            id="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder='Your secret password'
                                            className="w-full pl-12 px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M8 6H16V8H8V6ZM4 10V8H8V10H4ZM2 12V10H4V12H2ZM2 14V12H0V14H2ZM4 16H2V14H4V16ZM8 18H4V16H8V18ZM16 18V20H8V18H16ZM20 16V18H16V16H20ZM22 14V16H20V14H22ZM22 12H24V14H22V12ZM20 10H22V12H20V10ZM20 10V8H16V10H20ZM10 11H14V15H10V11Z" fill="black" />
                                            </svg>
                                        </div>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder='Do not forget it'
                                            className="w-full pl-12 px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200"
                                            required
                                        />
                                    </div>
                                </div>
                                <PasswordResetInfoBox />

                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-red-200 font-medium transition duration-300 border-2 shadow-[5px_5px_0px_0px_rgba(0,0,0)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg width="24" height="24" className='animate-spin' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.9999 2H10.9999V8H12.9999V2ZM12.9999 16H10.9999V22H12.9999V16ZM21.9998 11V13L15.9998 13V11H21.9998ZM7.99963 13V11H1.99963V13L7.99963 13ZM14.9996 6.99997H16.9996V8.99997H14.9996V6.99997ZM18.9995 4.99997H16.9995V6.99997H18.9995V4.99997ZM8.99963 6.99997H6.99963V8.99997H8.99963V6.99997ZM4.99973 4.99997H6.99973V6.99997H4.99973V4.99997ZM14.9996 17H16.9995V18.9999H18.9995V16.9999H16.9996V15H14.9996V17ZM6.99963 16.9999V15H8.99963V17H6.99973V18.9999H4.99973V16.9999H6.99963Z" fill="black" />
                                            </svg>
                                            <span>Signing Up...</span>
                                        </>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </button>
                            </form>
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
    return <div className="min-h-screen w-full flex items-center justify-center">
        <Image
            src="/heart.svg"
            width={100}
            height={100}
            alt="Heart Logo"
            className="animate-heartbeat"
        />
    </div>;
}

export default function Auth() {
    return (
        <Suspense fallback={<AuthLoading />}>
            <AuthContent />
        </Suspense>
    );
}