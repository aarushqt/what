import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username }
                });

                if (!user || !user.password) return null;

                const valid = await bcrypt.compare(credentials.password, user.password);
                if (!valid) return null;

                return {
                    id: user.id,
                    username: user.username,
                    name: user.name
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.name = token.name;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt" as const
    },
    secret: process.env.NEXTAUTH_SECRET
};

export default authOptions;