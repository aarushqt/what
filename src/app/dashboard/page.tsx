import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { Session } from "next-auth";

export default async function DashboardPage() {
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/");
    }

    return <DashboardClient user={session.user} />;
}
