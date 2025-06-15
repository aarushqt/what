import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ person: [] });

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) return NextResponse.json({ person: [] });

    const persons = await prisma.person.findMany({
        where: { userId: user.id },
        include: { messages: true },
    });

    return NextResponse.json({ person: persons });
}


export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { name } = body;
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return new NextResponse('User not found', { status: 404 });

    const Slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + nanoid(10);

    console.log('Creating person with name:', name, 'and slug:', Slug);

    const person = await prisma.person.create({
        data: {
            name,
            slug: Slug,
            userId: user.id
        }
    });

    return NextResponse.json({ person });
}


export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) return new NextResponse('Slug is required', { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return new NextResponse('User not found', { status: 404 });

    // Find the person and make sure it belongs to the current user
    const person = await prisma.person.findFirst({
        where: {
            slug: slug,
            userId: user.id
        }
    });

    if (!person) return new NextResponse('Person not found or unauthorized', { status: 404 });

    // Delete all messages associated with the person first
    await prisma.message.deleteMany({
        where: { personId: person.id }
    });

    // Then delete the person
    await prisma.person.delete({
        where: { id: person.id }
    });

    return NextResponse.json({ success: true });
}
