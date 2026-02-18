"use client";

import { EfficiencyHub } from "@/components/dashboard/efficiency-hub";
import { getCurrentUser } from "@/lib/auth/mock-auth";
import { AdminLevel } from "@/types";

export default function EfficiencyPage() {
    const user = getCurrentUser();

    // Only Levels 1, 2, and 3 are supposed to see efficiency metrics based on MainNav
    if (user.role === AdminLevel.LEVEL_4) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground text-lg">CXO Dashboard provides consolidated trends. Dedicated efficiency hub is for operational levels.</p>
            </div>
        );
    }

    return (
        <EfficiencyHub level={user.role} />
    );
}
