import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    const data = await req.formData();
    const content = data.get('content') as string;
    const emoji = data.get('emoji') as string;
    const expectedResponse = data.get('expectedResponse') as string;
    const slug = data.get('slug') as string;

    const person = await prisma.person.findUnique({ where: { slug } });
    if (!person) return NextResponse.json({ error: 'Invalid link' }, { status: 400 });

    await prisma.message.create({
        data: {
            content,
            emoji,
            expectedResponse,
            personId: person.id
        }
    });

    return NextResponse.redirect(new URL(`/share/${slug}?submitted=true`, req.url));
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get('id');

    if (!messageId) {
        return new NextResponse('Message ID is required', { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return new NextResponse('User not found', { status: 404 });
    }

    const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: { person: true },
    });

    if (!message) {
        return new NextResponse('Message not found', { status: 404 });
    }

    if (message.person.userId !== user.id) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    // Update the message to mark it as done
    const updatedMessage = await prisma.message.update({
        where: { id: messageId },
        data: { done: true },
    });

    return NextResponse.json({ success: true, message: updatedMessage });
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get('id');

    if (!messageId) {
        return new NextResponse('Message ID is required', { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return new NextResponse('User not found', { status: 404 });
    }

    const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: { person: true },
    });

    if (!message) {
        return new NextResponse('Message not found', { status: 404 });
    }

    if (message.person.userId !== user.id) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    await prisma.message.delete({
        where: { id: messageId },
    });

    return NextResponse.json({ success: true });
}
