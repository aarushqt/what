import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const data = await req.formData();
    const content = data.get('content') as string;
    const emoji = data.get('emoji') as string;
    const slug = data.get('slug') as string;

    const person = await prisma.person.findUnique({ where: { slug } });
    if (!person) return NextResponse.json({ error: 'Invalid link' }, { status: 400 });

    await prisma.message.create({
        data: {
            content,
            emoji,
            personId: person.id
        }
    });

    return NextResponse.redirect(new URL(`/share/${slug}?submitted=true`, req.url));
}
