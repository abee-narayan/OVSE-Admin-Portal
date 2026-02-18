"use client";

import { useEffect } from "react";
import { AdminLevel } from "@/types";
import { getCurrentUser, setCurrentRole } from "@/lib/auth/mock-auth";
import { EfficiencyHub } from "./efficiency-hub";
import { ReviewerDashboard } from "./reviewer-dashboard";
import { CXODashboard } from "./cxo-dashboard";

export function DashboardContainer({ role }: { role?: AdminLevel }) {
    const user = getCurrentUser();
    const activeRole = role || user.role;

    useEffect(() => {
        if (role) {
            setCurrentRole(role);
        }
    }, [role]);

    switch (activeRole) {
        case AdminLevel.LEVEL_1:
        case AdminLevel.LEVEL_2:
            return <EfficiencyHub level={activeRole} />;
        case AdminLevel.LEVEL_3:
            return <ReviewerDashboard />;
        case AdminLevel.LEVEL_4:
            return <CXODashboard />;
        default:
            return <div className="p-8 text-center text-slate-500">Access Denied: Invalid Role Context</div>;
    }
}
