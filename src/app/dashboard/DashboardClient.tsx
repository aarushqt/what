'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { formatDistanceToNow, format } from 'date-fns';

interface Message {
    id: string;
    content: string;
    emoji: string;
    done: boolean;
    createdAt: string;
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
    const [showMarkDoneModal, setShowMarkDoneModal] = useState(false);
    const [messageToMarkDone, setMessageToMarkDone] = useState<Message | null>(null);
    const [currentPersonSlugForMessageAction, setCurrentPersonSlugForMessageAction] = useState<string | null>(null);
    const [isCreatingPerson, setIsCreatingPerson] = useState(false);
    const [isDeletingPerson, setIsDeletingPerson] = useState(false);
    const [isMarkingMessageDone, setIsMarkingMessageDone] = useState(false);
    const [expandedDoneSections, setExpandedDoneSections] = useState<Record<string, boolean>>({});

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
        setIsCreatingPerson(true);
        try {
            const res = await fetch('/api/person', {
                method: 'POST',
                body: JSON.stringify({ name }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                const data = await res.json();
                const newPerson = {
                    ...data.person,
                    messages: data.person.messages || []
                };
                setPersons([...persons, newPerson]);
                setShowModal(false);
                setName('');
            }
        } catch (error) {
            console.error("Error creating person:", error);
        } finally {
            setIsCreatingPerson(false);
        }
    };

    const handleDelete = async (person: Person) => {
        setPersonToDelete(person);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!personToDelete) return;

        setIsDeletingPerson(true);
        try {
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
        } catch (error) {
            console.error("Error deleting person:", error);
        } finally {
            setIsDeletingPerson(false);
        }
    };

    const handleMarkMessageDone = (message: Message, personSlug: string) => {
        setMessageToMarkDone(message);
        setCurrentPersonSlugForMessageAction(personSlug);
        setShowMarkDoneModal(true);
    };

    const confirmMarkMessageDone = async () => {
        if (!messageToMarkDone || !currentPersonSlugForMessageAction) return;

        setIsMarkingMessageDone(true);
        try {
            const res = await fetch(`/api/message?id=${messageToMarkDone.id}`, {
                method: 'PATCH',
            });

            if (res.ok) {
                setPersons(prevPersons =>
                    prevPersons.map(person =>
                        person.slug === currentPersonSlugForMessageAction
                            ? {
                                ...person,
                                messages: person.messages.map(msg =>
                                    msg.id === messageToMarkDone.id
                                        ? { ...msg, done: true }
                                        : msg
                                ),
                            }
                            : person
                    )
                );
                setShowMarkDoneModal(false);
                setMessageToMarkDone(null);
                setCurrentPersonSlugForMessageAction(null);
            } else {
                console.error("Failed to mark message as done");
            }
        } catch (error) {
            console.error("Error marking message as done:", error);
        } finally {
            setIsMarkingMessageDone(false);
        }
    };

    const toggleDoneSection = (personSlug: string) => {
        setExpandedDoneSections(prev => ({
            ...prev,
            [personSlug]: !prev[personSlug]
        }));
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-4xl font-playfair text-red-400 font-semibold">Your Girlfriend</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-red-200 flex hover:cursor-pointer items-center gap-4 py-3 px-10 border-2 border-black text-black font-lexend text-2xl font-medium hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] transition duration-200"
                    ><svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18 2H12V3.99995H10.0002V9.99995H12.0002V4H18V2ZM18 10H12V12H18V10ZM18.0002 3.99995H20.0002V9.99995H18.0002V3.99995ZM7 15.9999H9V14H21V16H9V20H21.0002V15.9999H23.0002V21.9999H23V22H7V21.9999V20V15.9999ZM3 8H5V10H7V12H5V14H3V12H1V10H3V8Z" fill="black" />
                        </svg>
                        Add girlfriend
                    </button>
                </div>

                {persons.length === 0 ? (
                    <p className="text-gray-500 mb-6">You haven&apos;t added any girlfriend yet.</p>
                ) : (
                    <div className="space-y-8">
                        {persons.map(person => {
                            const activeMessages = person.messages.filter(msg => !msg.done);
                            const doneMessages = person.messages.filter(msg => msg.done);
                            const isDoneSectionExpanded = expandedDoneSections[person.slug] || false;

                            return (
                                <div key={person.slug} className="border-2 p-4">
                                    <div className="mb-3 flex justify-between items-start">
                                        <div>
                                            <p className="text-3xl font-semibold text-gray-800 font-playfair">{person.name}</p>
                                            <p className="text-gray-700 text-sm mt-1">
                                                Complaint link:{' '}
                                                <code className="bg-gray-100 px-2 py-1 rounded">{`${process.env.NEXT_PUBLIC_BASE_URL}/share/${person.slug}`}</code>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(person)}
                                            className='hover:cursor-pointer hover:scale-110 transition-transform duration-200'
                                        >
                                            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M5 3H3V21H5H19H21V3H19H5ZM19 5V19H5V5H19ZM16 11H8V13H16V11Z" fill="black" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="text-xl font-lexend font-medium text-gray-700 mb-4">This is how deep in the water you are:</h4>
                                        {activeMessages.length === 0 ? (
                                            <p className="text-gray-500 text-sm">Damn it&apos;s so peaceful here!</p>
                                        ) : (
                                            <ul className="space-y-2">
                                                {activeMessages.map((msg) => (
                                                    <li
                                                        key={msg.id}
                                                        className="flex gap-2 items-center font-lexend justify-center"
                                                    >
                                                        <div className="flex-grow border-2 p-3 bg-red-100">
                                                            <div className="flex items-center gap-6">
                                                                <span className="text-3xl">{msg.emoji}</span>
                                                                <span className="text-gray-800">{msg.content}</span>
                                                            </div>
                                                            <div className="text-right text-xs text-gray-500 mt-2">
                                                                {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleMarkMessageDone(msg, person.slug)}
                                                            className="flex-shrink-0 flex items-center gap-4 px-4 py-3 bg-red-200 border-2 shadow-[5px_5px_0px_0px_rgba(0,0,0)] font-lexend text-xl font-medium hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] transition duration-200"
                                                            title="Mark Resolved"
                                                            disabled={isMarkingMessageDone && messageToMarkDone?.id === msg.id}
                                                        >
                                                            {isMarkingMessageDone && messageToMarkDone?.id === msg.id ? (
                                                                <svg width="24" height="24" className='animate-spin' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.9999 2H10.9999V8H12.9999V2ZM12.9999 16H10.9999V22H12.9999V16ZM21.9998 11V13L15.9998 13V11H21.9998ZM7.99963 13V11H1.99963V13L7.99963 13ZM14.9996 6.99997H16.9996V8.99997H14.9996V6.99997ZM18.9995 4.99997H16.9995V6.99997H18.9995V4.99997ZM8.99963 6.99997H6.99963V8.99997H8.99963V6.99997ZM4.99973 4.99997H6.99973V6.99997H4.99973V4.99997ZM14.9996 17H16.9995V18.9999H18.9995V16.9999H16.9996V15H14.9996V17ZM6.99963 16.9999V15H8.99963V17H6.99973V18.9999H4.99973V16.9999H6.99963Z" fill="black" />
                                                                </svg>
                                                            ) : (
                                                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M15 6H17V8H15V6ZM13 10V8H15V10H13ZM11 12V10H13V12H11ZM9 14V12H11V14H9ZM7 16V14H9V16H7ZM5 16H7V18H5V16ZM3 14H5V16H3V14ZM3 14H1V12H3V14ZM11 16H13V18H11V16ZM15 14V16H13V14H15ZM17 12V14H15V12H17ZM19 10V12H17V10H19ZM21 8H19V10H21V8ZM21 8H23V6H21V8Z" fill="black" />
                                                                </svg>
                                                            )}
                                                            {isMarkingMessageDone && messageToMarkDone?.id === msg.id ? "Resolving..." : "Mark as Done"}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {doneMessages.length > 0 && (
                                        <div className="mt-6 border-t pt-4">
                                            <button
                                                onClick={() => toggleDoneSection(person.slug)}
                                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-lexend"
                                            >
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`transform transition-transform ${isDoneSectionExpanded ? 'rotate-90' : ''}`}
                                                >
                                                    <path d="M8 4L16 12L8 20" stroke="currentColor" strokeWidth="2" />
                                                </svg>
                                                <span>Resolved Issues ({doneMessages.length})</span>
                                            </button>

                                            {isDoneSectionExpanded && (
                                                <ul className="space-y-2 mt-3 pl-6">
                                                    {doneMessages.map((msg) => (
                                                        <li
                                                            key={msg.id}
                                                            className="flex gap-2 items-center font-lexend"
                                                        >
                                                            <div className="flex-grow border-2 p-3 bg-gray-100 opacity-70">
                                                                <div className="flex items-center gap-6">
                                                                    <span className="text-3xl">{msg.emoji}</span>
                                                                    <span className="text-gray-600 line-through">{msg.content}</span>
                                                                </div>
                                                                <div className="text-right text-xs text-gray-500 mt-2">
                                                                    Marked as resolved · {format(new Date(msg.createdAt), 'MMM d, yyyy HH:mm')}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white border-2 p-6 space-y-4">
                            <h2 className="text-3xl font-playfair">What&apos;s her name?</h2>
                            <input
                                type="text"
                                className="border px-3 py-2 w-96"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="pookie, sweetheart, etc."
                            />
                            <div className="flex justify-between items-center mt-12">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 border-2 cursor-pointer font-lexend text-xl font-medium hover:shadow-[5px_5px_0px_0px_rgba(0,0,0)] transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="px-4 py-2 flex items-center gap-4 bg-red-200 border-2 shadow-[5px_5px_0px_0px_rgba(0,0,0)] font-lexend text-xl font-medium hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] transition duration-200"
                                    disabled={!name.trim() || isCreatingPerson}
                                >
                                    {isCreatingPerson ? (
                                        <svg width="24" height="24" className='animate-spin' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12.9999 2H10.9999V8H12.9999V2ZM12.9999 16H10.9999V22H12.9999V16ZM21.9998 11V13L15.9998 13V11H21.9998ZM7.99963 13V11H1.99963V13L7.99963 13ZM14.9996 6.99997H16.9996V8.99997H14.9996V6.99997ZM18.9995 4.99997H16.9995V6.99997H18.9995V4.99997ZM8.99963 6.99997H6.99963V8.99997H8.99963V6.99997ZM4.99973 4.99997H6.99973V6.99997H4.99973V4.99997ZM14.9996 17H16.9995V18.9999H18.9995V16.9999H16.9996V15H14.9996V17ZM6.99963 16.9999V15H8.99963V17H6.99973V18.9999H4.99973V16.9999H6.99963Z" fill="black" />
                                        </svg>
                                    ) : (
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M23 9V10H22V11H21V12H20V13H19V14H17V13H16V12H15V11H16V10H17V11H19V10H20V9H21V8H22V9H23Z" fill="black" />
                                            <path d="M13 6V9H12V11H10V12H7V11H5V9H4V6H5V4H7V3H10V4H12V6H13Z" fill="black" />
                                            <path d="M16 16V20H15V21H2V20H1V16H2V15H3V14H4V13H6V14H11V13H13V14H14V15H15V16H16Z" fill="black" />
                                        </svg>
                                    )}
                                    {isCreatingPerson ? "Adding..." : "Add"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showDeleteModal && personToDelete && (
                    <div className="fixed inset-0 bg-black/40 font-lexend flex items-center justify-center z-50">
                        <div className="bg-white p-6 space-y-4 max-w-md border-2">
                            <h2 className="text-3xl font-semibold font-playfair text-red-600">Confirm Deletion</h2>
                            <p className="text-gray-700">
                                Are you sure you want to delete <span className="font-semibold">{personToDelete.name}</span>? This action cannot be undone and all associated messages will be permanently removed.
                            </p>
                            <div className="flex justify-between mt-12">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setPersonToDelete(null);
                                    }}
                                    className="px-4 py-2 text-xl bg-gray-200 border-2 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-200 border-2 border-black cursor-pointer flex items-center gap-2 shadow-[5px_5px_0px_0px_rgba(0,0,0)] font-lexend text-xl font-medium hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] transition duration-200"
                                    disabled={isDeletingPerson}
                                >
                                    {isDeletingPerson && (
                                        <svg width="24" height="24" className='animate-spin' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12.9999 2H10.9999V8H12.9999V2ZM12.9999 16H10.9999V22H12.9999V16ZM21.9998 11V13L15.9998 13V11H21.9998ZM7.99963 13V11H1.99963V13L7.99963 13ZM14.9996 6.99997H16.9996V8.99997H14.9996V6.99997ZM18.9995 4.99997H16.9995V6.99997H18.9995V4.99997ZM8.99963 6.99997H6.99963V8.99997H8.99963V6.99997ZM4.99973 4.99997H6.99973V6.99997H4.99973V4.99997ZM14.9996 17H16.9995V18.9999H18.9995V16.9999H16.9996V15H14.9996V17ZM6.99963 16.9999V15H8.99963V17H6.99973V18.9999H4.99973V16.9999H6.99963Z" fill="black" />
                                        </svg>
                                    )}
                                    {isDeletingPerson ? "Removing..." : "Remove"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showMarkDoneModal && messageToMarkDone && (
                    <div className="fixed inset-0 bg-black/40 font-lexend flex items-center justify-center z-50">
                        <div className="bg-white p-6 space-y-4 max-w-md border-2">
                            <h2 className="text-4xl font-semibold font-playfair text-red-500">Are you sure?</h2>
                            <p className="text-gray-700">
                                Have you resolved this issue? Once marked as done, it will be moved to resolved issues.
                            </p>
                            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
                                {messageToMarkDone.emoji} {messageToMarkDone.content}
                            </blockquote>
                            <div className="flex justify-between gap-2 mt-12">
                                <button
                                    onClick={() => {
                                        setShowMarkDoneModal(false);
                                        setMessageToMarkDone(null);
                                        setCurrentPersonSlugForMessageAction(null);
                                    }}
                                    className="px-4 py-2 text-xl bg-gray-200 border-2 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmMarkMessageDone}
                                    className="px-4 py-2 bg-red-200 border-2 border-black cursor-pointer flex items-center gap-2 shadow-[5px_5px_0px_0px_rgba(0,0,0)] font-lexend text-xl font-medium hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] transition duration-200"
                                    disabled={isMarkingMessageDone}
                                >
                                    {isMarkingMessageDone && (
                                        <svg width="24" height="24" className='animate-spin' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12.9999 2H10.9999V8H12.9999V2ZM12.9999 16H10.9999V22H12.9999V16ZM21.9998 11V13L15.9998 13V11H21.9998ZM7.99963 13V11H1.99963V13L7.99963 13ZM14.9996 6.99997H16.9996V8.99997H14.9996V6.99997ZM18.9995 4.99997H16.9995V6.99997H18.9995V4.99997ZM8.99963 6.99997H6.99963V8.99997H8.99963V6.99997ZM4.99973 4.99997H6.99973V6.99997H4.99973V4.99997ZM14.9996 17H16.9995V18.9999H18.9995V16.9999H16.9996V15H14.9996V17ZM6.99963 16.9999V15H8.99963V17H6.99973V18.9999H4.99973V16.9999H6.99963Z" fill="black" />
                                        </svg>
                                    )}
                                    {isMarkingMessageDone ? "Resolving..." : "Mark as Resolved"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}