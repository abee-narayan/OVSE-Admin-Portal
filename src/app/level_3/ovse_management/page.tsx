"use client";
// L3 OVSE Management — Recommendation & Review queue (AD/DD level)
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ApplicationTable } from "@/components/dashboard/application-table";
import { AdminLevel } from "@/types";
import { ClipboardCheck } from "lucide-react";

export default function L3OvsePage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">OVSE Management</h2>
                <p className="text-muted-foreground text-sm mt-1">
                    L3 Recommendation Queue — review applications escalated from L2 and recommend for final approval or rejection.
                </p>
            </div>
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <ClipboardCheck className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <CardTitle className="text-base">Application Recommendation Queue</CardTitle>
                            <CardDescription className="text-xs">Applications at L3 for recommendations to Director level</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ApplicationTable level={AdminLevel.LEVEL_3} />
                </CardContent>
            </Card>
        </div>
    );
}
