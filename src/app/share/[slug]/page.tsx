import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Navbar from '@/components/Navbar';
import SubmitForm from './SubmitForm';
import PastMessages from './PastMessages';

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

type PersonWithUserAndMessages = {
    id: string;
    name: string;
    slug: string;
    userId: string;
    createdAt: Date;
    user: {
        id: string;
        name: string;
        email: string;
    } | null;
    messages: Array<{
        id: string;
        content: string;
        emoji: string;
        createdAt: Date;
        done: boolean;
    }>;
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
        include: {
            user: true,
            messages: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        },
    }) as PersonWithUserAndMessages | null;

    if (!person) return notFound();

    const success = resolvedSearchParams?.success === 'true';

    return (
        <>
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center p-6 mt-20">
                <h1 className="text-5xl font-bold font-playfair mb-4">Hello, {person.name} 👋</h1>
                <p className="text-gray-700 mb-6 text-2xl">
                    Leave a message for <span className="font-semibold text-3xl">{person.user?.name || 'Partner'}</span>
                </p>

                {success ? (
                    <div className="flex flex-col items-center justify-center w-full max-w-md p-6 bg-green-50 rounded-lg">
                        <div className="text-green-600 text-5xl mb-4">✓</div>
                        <p className="text-center text-lg font-medium text-green-700">
                            Your complaint was officially filed
                        </p>
                    </div>
                ) : (
                    <SubmitForm slug={slug} submitMessage={submitMessage} />
                )}

                {person.messages.length > 0 && (
                    <div className="w-full max-w-md mt-12">
                        <PastMessages messages={person.messages} />
                    </div>
                )}
            </div>
        </>
    );
}