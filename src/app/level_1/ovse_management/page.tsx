"use client";
// L1 OVSE Management — Application scrutiny queue for Support Desk
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ApplicationTable } from "@/components/dashboard/application-table";
import { AdminLevel } from "@/types";
import { FileSearch } from "lucide-react";

export default function L1OvsePage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">OVSE Management</h2>
                <p className="text-muted-foreground text-sm mt-1">
                    L1 Scrutiny Queue — review, flag and forward applications for Level 1 initial processing.
                </p>
            </div>
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg"><FileSearch className="h-5 w-5 text-blue-600" /></div>
                        <div>
                            <CardTitle className="text-base">Application Scrutiny Queue</CardTitle>
                            <CardDescription className="text-xs">Applications awaiting L1 initial review</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ApplicationTable level={AdminLevel.LEVEL_1} />
                </CardContent>
            </Card>
        </div>
    );
}
