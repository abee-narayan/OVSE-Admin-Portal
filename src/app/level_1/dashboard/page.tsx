// L1 Dashboard — personal KPI focus (home screen for Support Desk)
"use client";

import { EfficiencyHub } from "@/components/dashboard/efficiency-hub";
import { AdminLevel } from "@/types";

export default function L1DashboardPage() {
    return <EfficiencyHub level={AdminLevel.LEVEL_1} />;
}
