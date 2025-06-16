'use client';

import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';

interface Message {
    id: string;
    content: string;
    emoji: string;
    done: boolean;
    createdAt: Date | string;
}

export default function PastMessages({ messages }: { messages: Message[] }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="border-t-2 pt-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 font-lexend text-gray-600 hover:text-gray-900 w-full justify-between"
            >
                <span className="text-lg font-medium">Past Messages ({messages.length})</span>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {isExpanded && (
                <div className="mt-4 space-y-3">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`p-3 border-2 ${message.done ? 'bg-gray-100 opacity-80' : 'bg-red-50'}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">{message.emoji}</span>
                                <span className={`${message.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                    {message.content}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                <span>{message.done ? 'Resolved' : 'Pending'}</span>
                                <span>
                                    {message.done
                                        ? format(new Date(message.createdAt), 'MMM d, yyyy HH:mm')
                                        : formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}