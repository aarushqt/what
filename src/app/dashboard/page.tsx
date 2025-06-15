import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/");
    }

    return <DashboardClient user={{
        name: session.user.name || undefined,
        email: session.user.email || undefined
    }} />;
}
