'use client';

import Image from 'next/image';
import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';

interface Message {
    id: string;
    content: string;
    emoji: string;
    done: boolean;
    createdAt: Date | string;
}

const emojiOptions = [
    { value: 'crying', file: 'crying.svg', alt: 'Crying face' },
    { value: 'dead', file: 'dead.svg', alt: 'Dead face' },
    { value: 'frown', file: 'frown.svg', alt: 'Frown face' },
    { value: 'happy-open', file: 'happy-open.svg', alt: 'Happy face' },
    { value: 'love-eyes', file: 'love-eyes.svg', alt: 'Love eyes face' },
    { value: 'puppy-face', file: 'puppy-face.svg', alt: 'Puppy face' },
    { value: 'sad', file: 'sad.svg', alt: 'Sad face' },
    { value: 'satisfied', file: 'satisfied.svg', alt: 'Satisfied face' },
    { value: 'smile', file: 'smile.svg', alt: 'Smile face' },
    { value: 'surprised', file: 'surprised.svg', alt: 'Surprised face' },
    { value: 'wailing', file: 'wailing.svg', alt: 'Wailing face' },
    { value: 'wink', file: 'wink.svg', alt: 'Wink face' },
];

// Helper function to get emoji file from value
const getEmojiFile = (emojiValue: string): string => {
    const foundEmoji = emojiOptions.find(emoji => emoji.value === emojiValue);
    return foundEmoji ? foundEmoji.file : 'smile.svg'; // Default to smile.svg if not found
};

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
                                {message.emoji && (
                                    <div className="w-16 h-10 relative flex-shrink-0">
                                        <Image
                                            src={`/emoticons/${getEmojiFile(message.emoji)}`}
                                            alt={`${message.emoji} emoji`}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                )}
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