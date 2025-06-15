import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Navbar from '@/components/Navbar';

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
        <>
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center p-6 mt-20">
                <h1 className="text-5xl font-bold font-playfair mb-4">Hello, {person.name} 👋</h1>
                <p className="text-gray-700 mb-6 text-2xl">
                    Leave a message for <span className="font-semibold text-3xl">{person.user.name || person.user.email}</span>
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
                        <p className='text-center font-bold text-xl'>How are you feeling?</p>
                        <div className="flex gap-2 justify-between">
                            {['😄', '😢', '🔥', '💀', '❤️'].map((emoji) => (
                                <label key={emoji} className="cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="emoji"
                                        value={emoji}
                                        className="hidden peer"
                                        required
                                    />
                                    <span className="text-3xl inline-block p-2 rounded-full peer-checked:border-2 peer-checked:border-black">{emoji}</span>
                                </label>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="bg-red-200 py-3 mt-6 border-2 border-black text-black font-lexend text-2xl font-medium hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] transition duration-300 flex items-center justify-center"
                        >
                            Submit
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}
