import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

async function submitMessage(formData: FormData) {
    'use server';

    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const emoji = formData.get('emoji') as string;

    await prisma.message.create({
        data: {
            content,
            emoji,
            person: { connect: { slug } }
        }
    });

    revalidatePath(`/share/${slug}`);
    redirect(`/share/${slug}?success=true`);
}

type PageProps = {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ success?: string }>;
};

export default async function SharePage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const resolvedSearchParams = searchParams ? await searchParams : undefined;

    const person = await prisma.person.findUnique({
        where: { slug },
        include: { user: true },
    });

    if (!person) return notFound();

    const success = resolvedSearchParams?.success === 'true';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold mb-4">Hello, {person.name} 👋</h1>
            <p className="text-lg text-gray-700 mb-6">
                Leave a message for <span className="font-semibold">{person.user.name || person.user.email}</span>
            </p>

            {success ? (
                <div className="flex flex-col items-center justify-center w-full max-w-md p-6 bg-green-50 rounded-lg">
                    <div className="text-green-600 text-5xl mb-4">✓</div>
                    <p className="text-center text-lg font-medium text-green-700">
                        Your complaint was officially filed
                    </p>
                </div>
            ) : (
                <form
                    action={submitMessage}
                    className="flex flex-col gap-4 w-full max-w-md"
                >
                    <input type="hidden" name="slug" value={slug} />

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
            )}
        </div>
    );
}
