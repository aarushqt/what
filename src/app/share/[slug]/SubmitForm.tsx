'use client';

import { useState } from 'react';

interface SubmitFormProps {
    slug: string;
    submitMessage: (formData: FormData) => Promise<void>;
}

export default function SubmitForm({ slug, submitMessage }: SubmitFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            await submitMessage(formData);
        } catch (error) {
            console.error('Error submitting message:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full max-w-md"
        >
            <input type="hidden" name="slug" value={slug} />

            <textarea
                name="content"
                placeholder="Pour your heart out here..."
                required
                className="border-2 p-3 resize-none h-32"
                disabled={isSubmitting}
            />
            <p className='text-center font-bold text-xl'>How are you feeling?</p>
            <div className="flex gap-2 justify-between">
                {['😊', '😔', '😡', '😰', '🥱'].map((emoji) => (
                    <label key={emoji} className="cursor-pointer group">
                        <input
                            type="radio"
                            name="emoji"
                            value={emoji}
                            className="hidden peer"
                            required
                            disabled={isSubmitting}
                        />
                        <span className="text-3xl inline-block p-2 rounded-full peer-checked:border-2 peer-checked:border-black peer-checked:bg-red-200">{emoji}</span>
                    </label>
                ))}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-200 py-3 mt-6 border-2 border-black text-black font-lexend text-2xl font-medium hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] transition duration-300 flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <svg width="24" height="24" className='animate-spin' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12.9999 2H10.9999V8H12.9999V2ZM12.9999 16H10.9999V22H12.9999V16ZM21.9998 11V13L15.9998 13V11H21.9998ZM7.99963 13V11H1.99963V13L7.99963 13ZM14.9996 6.99997H16.9996V8.99997H14.9996V6.99997ZM18.9995 4.99997H16.9995V6.99997H18.9995V4.99997ZM8.99963 6.99997H6.99963V8.99997H8.99963V6.99997ZM4.99973 4.99997H6.99973V6.99997H4.99973V4.99997ZM14.9996 17H16.9995V18.9999H18.9995V16.9999H16.9996V15H14.9996V17ZM6.99963 16.9999V15H8.99963V17H6.99973V18.9999H4.99973V16.9999H6.99963Z" fill="black" />
                        </svg>
                        Submitting...
                    </>
                ) : (
                    "Submit"
                )}
            </button>
        </form>
    );
}