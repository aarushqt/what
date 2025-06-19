"use client";

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import InputField from '@/components/InputField';
import FormButton from '@/components/FormButton';
import { ErrorAlert, SuccessAlert } from '@/components/Alert';
import PasswordInfoBox from '@/components/PasswordInfoBox';
import { UserIcon, PasswordIcon, ConfirmPasswordIcon } from '@/components/Icons';

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
        return <LoadingSpinner />;
    }

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
            const sanitizedUsername = formData.username.trim().replace(/[^\w]/g, '');

            if (!sanitizedUsername) {
                setError('Username cannot be empty or contain only special characters.');
                setIsLoading(false);
                return;
            }

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    username: sanitizedUsername,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to register.');
            }

            setSuccess('Registration successful! You can now sign in.');
            setFormData({ name: '', username: '', password: '', confirmPassword: '' });
            setIsSignIn(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
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
            const sanitizedUsername = formData.username.trim().replace(/[^\w]/g, '');

            if (!sanitizedUsername) {
                setError('Username cannot be empty or contain only special characters.');
                setIsLoading(false);
                return;
            }

            const result = await signIn('credentials', {
                redirect: false,
                username: sanitizedUsername,
                password: formData.password,
            });

            if (result?.error) {
                setError("Something's not right, please recheck.");
                return;
            }

            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to sign in');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="flex justify-center items-start">
                <div className="w-full px-4 sm:px-6 md:w-3/4 lg:w-1/2 xl:w-2/5 max-w-md mx-auto mt-8 sm:mt-28 font-lexend">
                    <div className="mb-6">
                        <h1 className="text-4xl sm:text-6xl font-bold text-red-400 text-center font-playfair">
                            {isSignIn ? 'Sign In' : 'Sign Up'}
                        </h1>
                    </div>

                    <ErrorAlert message={error} />
                    <SuccessAlert message={success} />

                    {isSignIn ? (
                        <form className="space-y-4" onSubmit={handleSignIn}>
                            <InputField
                                id="username"
                                label="Username"
                                type="text"
                                value={formData.username}
                                placeholder="Your unique username"
                                onChange={handleInputChange}
                                icon={<UserIcon />}
                            />

                            <InputField
                                id="password"
                                label="Password"
                                type="password"
                                value={formData.password}
                                placeholder="Your secret password"
                                onChange={handleInputChange}
                                icon={<PasswordIcon />}
                            />

                            <FormButton
                                isLoading={isLoading}
                                loadingText="Signing In..."
                                buttonText="Sign In"
                            />
                        </form>
                    ) : (
                        <form className="space-y-4" onSubmit={handleSignUp}>
                            <InputField
                                id="name"
                                label="Name"
                                type="text"
                                value={formData.name}
                                placeholder="LoverBoy McHandsome"
                                onChange={handleInputChange}
                                icon={<UserIcon />}
                            />

                            <InputField
                                id="username"
                                label="Username"
                                type="text"
                                value={formData.username}
                                placeholder="A unique username"
                                onChange={handleInputChange}
                                icon={<UserIcon />}
                            />

                            <InputField
                                id="password"
                                label="Password"
                                type="password"
                                value={formData.password}
                                placeholder="Your secret password"
                                onChange={handleInputChange}
                                icon={<PasswordIcon />}
                            />

                            <InputField
                                id="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                value={formData.confirmPassword}
                                placeholder="Do not forget it"
                                onChange={handleInputChange}
                                icon={<ConfirmPasswordIcon />}
                            />

                            <PasswordInfoBox message="I&apos;m too lazy to implement password reset, so for your sake and mine, remember it!" />

                            <FormButton
                                isLoading={isLoading}
                                loadingText="Signing Up..."
                                buttonText="Sign Up"
                            />
                        </form>
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

export default function Auth() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <AuthContent />
        </Suspense>
    );
}