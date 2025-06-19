import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';
import authOptions from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user?.username) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const passwordValid = await bcrypt.compare(currentPassword, user.password);
    if (!passwordValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { username: user.username },
        data: { password: hashedNewPassword }
    });

    return NextResponse.json({ success: true });
}
