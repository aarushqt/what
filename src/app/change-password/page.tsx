"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import InputField from '@/components/InputField';
import FormButton from '@/components/FormButton';
import { ErrorAlert, SuccessAlert } from '@/components/Alert';
import PasswordInfoBox from '@/components/PasswordInfoBox';
import { PasswordIcon, ConfirmPasswordIcon } from '@/components/Icons';

export default function ChangePassword() {
    const { status } = useSession();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <LoadingSpinner />;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        if (formData.newPassword === formData.currentPassword) {
            setError("New password cannot be the same as current password");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to change password.');
            }

            setSuccess('Password changed successfully!');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
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
                            Change Password
                        </h1>
                    </div>

                    <ErrorAlert message={error} />
                    <SuccessAlert message={success} />

                    <form className="space-y-4" onSubmit={handleChangePassword}>
                        <InputField
                            id="currentPassword"
                            label="Current Password"
                            type="password"
                            value={formData.currentPassword}
                            placeholder="Your current password"
                            onChange={handleInputChange}
                            icon={<PasswordIcon />}
                        />

                        <InputField
                            id="newPassword"
                            label="New Password"
                            type="password"
                            value={formData.newPassword}
                            placeholder="Your new password"
                            onChange={handleInputChange}
                            icon={<PasswordIcon />}
                        />

                        <InputField
                            id="confirmPassword"
                            label="Confirm New Password"
                            type="password"
                            value={formData.confirmPassword}
                            placeholder="Confirm your new password"
                            onChange={handleInputChange}
                            icon={<ConfirmPasswordIcon />}
                        />

                        <PasswordInfoBox message="Make sure to remember your new password! Choose something memorable but secure." />

                        <FormButton
                            isLoading={isLoading}
                            loadingText="Changing Password..."
                            buttonText="Change Password"
                        />
                    </form>
                </div>
            </main>
        </>
    );
}