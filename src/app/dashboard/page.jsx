import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const user = await getUserSession();

    if (!user) {
        redirect("/auth/signin?redirect=/dashboard");
    }

    if (user.role === "recruiter") {
        redirect("/dashboard/recruiter");
    }

    if (user.role === "admin") {
        redirect("/dashboard/admin");
    }

    // Default to seeker
    redirect("/dashboard/seeker");
}
