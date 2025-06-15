'use client';

import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface Message {
    id: string;
    content: string;
    emoji: string;
}

interface Person {
    name: string;
    slug: string;
    messages: Message[];
}

interface User {
    name?: string | null;
    email?: string | null;
}

export default function DashboardClient({ user }: { user: User }) {
    const [person, setPerson] = useState<Person | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchPerson = async () => {
            const res = await fetch('/api/person');
            if (res.ok) {
                const data = await res.json();
                setPerson(data.person);
            }
            setLoading(false);
        };
        fetchPerson();
    }, []);

    const handleCreate = async () => {
        const res = await fetch('/api/person', {
            method: 'POST',
            body: JSON.stringify({ name }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            const data = await res.json();
            setPerson(data.person);
            setShowModal(false);
        }
    };

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div>
            <div className="bg-white shadow p-4 flex justify-between items-center">
                <div className="font-medium">Welcome, {user.name || user.email || 'User'}</div>
                <button
                    onClick={handleSignOut}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded"
                >
                    Log out
                </button>
            </div>

            <div className="p-6">
                {!person ? (
                    <div>
                        <p className="mb-4 text-gray-700">You haven&apos;t created any person yet.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded shadow"
                        >
                            Create Person
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <p className="text-gray-800 text-lg font-semibold">Your Person</p>
                            <p className="text-gray-600">Name: {person.name}</p>
                            <p className="text-gray-600">
                                Link:{' '}
                                <code>{`${process.env.NEXT_PUBLIC_BASE_URL}/share/${person.slug}`}</code>
                            </p>
                        </div>

                        <div>
                            <h3 className="text-md font-semibold text-gray-800 mb-2">Received Messages</h3>
                            {person.messages.length === 0 ? (
                                <p className="text-gray-500">No messages received yet.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {person.messages.map((msg) => (
                                        <li
                                            key={msg.id}
                                            className="border rounded-lg p-3 bg-gray-50 flex items-center gap-3"
                                        >
                                            <span className="text-xl">{msg.emoji}</span>
                                            <span className="text-gray-800">{msg.content}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl space-y-4">
                            <h2 className="text-xl font-semibold">Enter a name for the person</h2>
                            <input
                                type="text"
                                className="border px-3 py-2 rounded w-full"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Aryan's Anonymous Box"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
