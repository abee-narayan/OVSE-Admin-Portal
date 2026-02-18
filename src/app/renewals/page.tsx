"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function RenewalsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Renewals Management</h2>
                <p className="text-muted-foreground">
                    Track and manage upcoming OVSE certificate renewals.
                </p>
            </div>

            <Card className="flex flex-col items-center justify-center py-20 bg-slate-50 border-dashed">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-slate-400" />
                </div>
                <CardTitle>Module Coming Soon</CardTitle>
                <CardDescription>
                    Renewal workflows are currently being integrated into the portal.
                </CardDescription>
            </Card>
        </div>
    );
}
