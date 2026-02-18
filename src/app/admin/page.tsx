"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">System Administration</h2>
                <p className="text-muted-foreground">
                    Manage system settings, roles, and permissions.
                </p>
            </div>

            <Card className="flex flex-col items-center justify-center py-20 bg-blue-50/50 border-blue-100">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Administrative Controls</CardTitle>
                <CardDescription>
                    User management and RBAC configuration tools will appear here.
                </CardDescription>
            </Card>
        </div>
    );
}
