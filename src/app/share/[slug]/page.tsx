import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
// import { revalidatePath } from 'next/cache';

interface Props {
    params: { slug: string };
}

export default async function SharePage({ params }: Props) {
    const resolvedParams = await params;
    const person = await prisma.person.findUnique({
        where: { slug: resolvedParams.slug }
    });

    if (!person) return notFound();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-semibold mb-4 text-center">
                Leave a message for <span className="text-blue-600">{person.name}</span>
            </h1>

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
