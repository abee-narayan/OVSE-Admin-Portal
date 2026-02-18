import { DashboardContainer } from "@/components/dashboard/dashboard-container";
import { AdminLevel } from "@/types";
import { notFound } from "next/navigation";

export default async function DashboardPage({ params }: { params: Promise<{ role: string }> }) {
    const { role } = await params;
    const roleParam = role.toUpperCase();

    // Validate if the role is a valid AdminLevel
    const validRoles = Object.values(AdminLevel) as string[];

    if (!validRoles.includes(roleParam)) {
        return notFound();
    }

    return (
        <div className="flex flex-col gap-8">
            <DashboardContainer role={roleParam as AdminLevel} />
        </div>
    );
}
