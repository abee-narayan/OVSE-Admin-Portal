"use client";

import { ApplicationTable } from "@/components/dashboard/application-table";
import { getCurrentUser } from "@/lib/auth/mock-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminLevel } from "@/types";

export default function ApplicationsPage() {
    const user = getCurrentUser();

    const getPageContent = (role: AdminLevel) => {
        switch (role) {
            case AdminLevel.LEVEL_1:
                return { title: "Recommendation Hub", desc: "Validate documentation and provide initial scrutiny recommendations." };
            case AdminLevel.LEVEL_2:
                return { title: "Review Center", desc: "Conduct deep-dive examination of policy compliance and technical data." };
            case AdminLevel.LEVEL_3:
                return { title: "Preapproval Dashboard", desc: "Evaluate risk profiles and prepare applications for final Directorate sign-off." };
            case AdminLevel.LEVEL_4:
                return { title: "Approval Portal", desc: "Execute final executive decisions and authorize certificate issuance." };
            default:
                return { title: "Application Review", desc: "Manage and review pending OVSE applications." };
        }
    };

    const { title, desc } = getPageContent(user.role);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">{title}</h2>
                <p className="text-slate-500 font-medium tracking-tight">
                    {desc}
                </p>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Inventory: Pending Tasks</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-blue-600 uppercase">
                        Current Queue: {user.role.replace('_', ' ')} Stage
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ApplicationTable level={user.role} />
                </CardContent>
            </Card>
        </div>
    );
}
