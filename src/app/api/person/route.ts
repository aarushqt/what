import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ person: null });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ person: null });

    const person = await prisma.person.findFirst({
        where: { userId: user.id },
        include: { messages: true },
    });

    return NextResponse.json({ person });
}


export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { name } = body;
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return new NextResponse('User not found', { status: 404 });

    const person = await prisma.person.create({
        data: {
            name,
            slug: nanoid(10),
            userId: user.id
        }
    });

    return NextResponse.json({ person });
}
