"use client";
// L4 OVSE Management — Application revocation, final approval & partner management
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ApplicationTable } from "@/components/dashboard/application-table";
import { AdminLevel } from "@/types";
import { ShieldAlert, Building2 } from "lucide-react";

export default function L4OvsePage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">OVSE Management</h2>
                <p className="text-muted-foreground text-sm mt-1">
                    L4 Final Authority — approve, reject or revoke OVSE partner applications. Actions are permanent and audit-logged.
                </p>
            </div>

            {/* Summary tiles */}
            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { label: "Active Partners", value: "2,481", sub: "Currently provisioned", icon: Building2, color: "bg-emerald-50 text-emerald-700" },
                    { label: "Awaiting Final Approval", value: "34", sub: "L3 recommended", icon: ShieldAlert, color: "bg-amber-50 text-amber-700" },
                    { label: "Revocations (30d)", value: "7", sub: "Security or compliance", icon: ShieldAlert, color: "bg-red-50 text-red-700" },
                ].map((s, i) => (
                    <Card key={i}>
                        <CardContent className="pt-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-500 mb-1">{s.label}</p>
                                    <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${s.color.split(' ')[0]}`}>
                                    <s.icon className={`h-5 w-5 ${s.color.split(' ')[1]}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <ShieldAlert className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <CardTitle className="text-base">Partner Application Management</CardTitle>
                            <CardDescription className="text-xs">
                                Active partners and pending final-approval applications. Use Review to approve, reject or revoke.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ApplicationTable level={AdminLevel.LEVEL_4} />
                </CardContent>
            </Card>
        </div>
    );
}
