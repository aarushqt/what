'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

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

export default function DashboardClient({ }: { user: User }) {
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [personToDelete, setPersonToDelete] = useState<Person | null>(null);
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

    const handleDelete = async (person: Person) => {
        setPersonToDelete(person);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!personToDelete) return;

        const res = await fetch(`/api/person?slug=${personToDelete.slug}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setPersons(persons.filter(p => p.slug !== personToDelete.slug));
            setShowDeleteModal(false);
            setPersonToDelete(null);
        } else {
            console.error("Failed to delete person");
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-lexend font-semibold">Your Girlfriend</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-red-200 py-3 px-10 mt-6 border-2 border-black text-black font-lexend text-2xl font-medium hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] transition duration-200"
                    >
                        Add girlfriend
                    </button>
                </div>

                {persons.length === 0 ? (
                    <p className="text-gray-500 mb-6">You haven&apos;t added any girlfriend yet.</p>
                ) : (
                    <div className="space-y-8">
                        {persons.map(person => (
                            <div key={person.slug} className="border-2 p-4">
                                <div className="mb-3 flex justify-between items-start">
                                    <div>
                                        <p className="text-3xl font-semibold text-gray-800 font-playfair">{person.name}</p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Complaint link:{' '}
                                            <code className="bg-gray-100 px-2 py-1 rounded">{`${process.env.NEXT_PUBLIC_BASE_URL}/share/${person.slug}`}</code>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(person)}
                                        className='hover:cursor-pointer hover:scale-110 transition-transform duration-200'

                                    >
                                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18 5V4H17V3H16V2H15V1H9V2H8V3H7V4H6V5H2V7H4V22H5V23H19V21H20V7H21V5H18ZM8 4H9V3H15V4H16V5H8V4ZM18 21H6V7H18V21Z" fill="black" />
                                            <path d="M10 9H8V19H10V9Z" fill="black" />
                                            <path d="M16 9H14V19H16V9Z" fill="black" />
                                        </svg>
                                    </button>
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
                                                    className="border-1 p-3 bg-red-100 flex items-center gap-3"
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

                {/* Delete Confirmation Modal */}
                {showDeleteModal && personToDelete && (
                    <div className="fixed inset-0 bg-black/40 font-lexend flex items-center justify-center z-50">
                        <div className="bg-white p-6 space-y-4 max-w-md border-2">
                            <h2 className="text-3xl font-semibold font-playfair text-red-600">Confirm Deletion</h2>
                            <p className="text-gray-700">
                                Are you sure you want to delete <span className="font-semibold">{personToDelete.name}</span>? This action cannot be undone and all associated messages will be permanently removed.
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setPersonToDelete(null);
                                    }}
                                    className="px-4 py-2 bg-gray-200 border-2 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 border-2 border-black cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}