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
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchPersons = async () => {
            const res = await fetch('/api/person');
            if (res.ok) {
                const data = await res.json();
                if (data.person) {
                    const personData = Array.isArray(data.person) ? data.person : [data.person];
                    const normalizedPersons: Person[] = personData.map((person: Omit<Person, 'messages'> & { messages?: Message[] }) => ({
                        ...person,
                        messages: person.messages || []
                    }));
                    setPersons(normalizedPersons);
                } else {
                    setPersons([]);
                }
            } else {
                console.error("Failed to fetch persons");
                setPersons([]);
            }
            setLoading(false);
        };
        fetchPersons();
    }, []);

    const handleCreate = async () => {
        const res = await fetch('/api/person', {
            method: 'POST',
            body: JSON.stringify({ name }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            const data = await res.json();
            // Ensure the new person has a messages array
            const newPerson = {
                ...data.person,
                messages: data.person.messages || []
            };
            setPersons([...persons, newPerson]);
            setShowModal(false);
            setName('');
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
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Your Persons</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow"
                    >
                        Create Person
                    </button>
                </div>

                {persons.length === 0 ? (
                    <p className="text-gray-500 mb-6">You haven&apos;t created any person yet.</p>
                ) : (
                    <div className="space-y-8">
                        {persons.map(person => (
                            <div key={person.slug} className="border rounded-lg p-4 bg-gray-50">
                                <div className="mb-3">
                                    <p className="text-lg font-semibold text-gray-800">{person.name}</p>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Share link:{' '}
                                        <code className="bg-gray-100 px-2 py-1 rounded">{`${process.env.NEXT_PUBLIC_BASE_URL}/share/${person.slug}`}</code>
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <h4 className="text-md font-medium text-gray-700 mb-2">Messages</h4>
                                    {!person.messages || person.messages.length === 0 ? (
                                        <p className="text-gray-500 text-sm">No messages received yet.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {person.messages.map((msg) => (
                                                <li
                                                    key={msg.id}
                                                    className="border rounded-lg p-3 bg-white flex items-center gap-3"
                                                >
                                                    <span className="text-xl">{msg.emoji}</span>
                                                    <span className="text-gray-800">{msg.content}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
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
                                    disabled={!name.trim()}
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