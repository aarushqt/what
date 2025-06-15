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
