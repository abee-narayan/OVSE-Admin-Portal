"use client";
// L2 Dashboard — Senior Support performance overview
import { ReviewerDashboard } from "@/components/dashboard/reviewer-dashboard";
import { EfficiencyHub } from "@/components/dashboard/efficiency-hub";
import { AdminLevel } from "@/types";

export default function L2DashboardPage() {
    return <EfficiencyHub level={AdminLevel.LEVEL_2} />;
}
