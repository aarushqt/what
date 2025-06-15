import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface Props {
    params: { slug: string };
}

export default async function SharePage({ params }: Props) {
    const resolvedParams = await params;
    const person = await prisma.person.findUnique({
        where: { slug: resolvedParams.slug },
        include: { user: true },
    });

    if (!person) return notFound();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold mb-4">Hello, {person.name} 👋</h1>
            <p className="text-lg text-gray-700 mb-6">
                Leave a message for <span className="font-semibold">{person.user.name || person.user.email}</span>
            </p>

            <form
                action={`/api/message`}
                method="POST"
                className="flex flex-col gap-4 w-full max-w-md"
            >
                <input
                    type="hidden"
                    name="slug"
                    value={person.slug}
                />
                <textarea
                    name="content"
                    placeholder="Write your message here..."
                    required
                    className="border p-3 rounded resize-none h-32"
                />

                <div className="flex gap-2 justify-center">
                    {['😄', '😢', '🔥', '💀', '❤️'].map((emoji) => (
                        <label key={emoji} className="cursor-pointer">
                            <input
                                type="radio"
                                name="emoji"
                                value={emoji}
                                className="hidden"
                                required
                            />
                            <span className="text-3xl">{emoji}</span>
                        </label>
                    ))}
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded shadow"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
