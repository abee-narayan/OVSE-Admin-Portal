"use client";
// L2 OVSE Management — Application examination (ASO/SO level)
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ApplicationTable } from "@/components/dashboard/application-table";
import { AdminLevel } from "@/types";
import { FileCheck } from "lucide-react";

export default function L2OvsePage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">OVSE Management</h2>
                <p className="text-muted-foreground text-sm mt-1">
                    L2 Examination Queue — perform technical evaluation and specialized configuration review.
                </p>
            </div>
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-cyan-100 rounded-lg"><FileCheck className="h-5 w-5 text-cyan-600" /></div>
                        <div>
                            <CardTitle className="text-base">Application Examination Queue</CardTitle>
                            <CardDescription className="text-xs">Applications at L2 for detailed technical examination</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ApplicationTable level={AdminLevel.LEVEL_2} />
                </CardContent>
            </Card>
        </div>
    );
}
