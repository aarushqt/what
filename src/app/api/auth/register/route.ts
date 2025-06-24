import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    const { username, password, name } = await req.json();

    if (!username || !password || !name) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
        return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const formattedUsername = username.toLowerCase().trim();

    await prisma.user.create({
        data: {
            username: formattedUsername,
            name,
            password: hashedPassword
        }
    });

    return NextResponse.json({ success: true }, { status: 201 });
}
