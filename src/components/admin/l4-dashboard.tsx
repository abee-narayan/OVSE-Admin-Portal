"use client";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { L4GlobalAccessControl } from "./l4-global-access-control";
import { L4AuditVault } from "./l4-audit-vault";
import { L4SessionRecorder } from "./l4-session-recorder";
import { ShieldCheck, Lock, Video } from "lucide-react";

export function L4Dashboard() {
    return (
        <div className="space-y-6">
            {/* Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden min-h-[180px] flex items-center">
                <Image
                    src="/hero-bg.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="relative z-10 flex items-center justify-between w-full px-10 py-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-orange-700 mb-1">L4 Super Admin</p>
                        <h2 className="text-2xl font-bold text-slate-800 leading-tight">System Governance</h2>
                        <p className="text-slate-600 text-sm mt-1 max-w-lg">
                            Emergency access controls, immutable audit vault, and session monitoring. All actions are permanently recorded.
                        </p>
                    </div>
                    <div className="hidden md:block shrink-0 relative h-36 w-36">
                        <Image
                            src="/hero-mascot.png"
                            alt="Aadhaar Mascot"
                            fill
                            className="object-contain drop-shadow-xl"
                        />
                    </div>
                </div>
            </div>

            {/* Tabs — Approval Queue moved to User Management */}
            <Tabs defaultValue="access-control">
                <TabsList className="grid grid-cols-3 w-full max-w-lg">
                    <TabsTrigger value="access-control" className="gap-1.5 text-xs">
                        <ShieldCheck className="h-3.5 w-3.5" /> Access Control
                    </TabsTrigger>
                    <TabsTrigger value="audit" className="gap-1.5 text-xs">
                        <Lock className="h-3.5 w-3.5" /> Audit Vault
                    </TabsTrigger>
                    <TabsTrigger value="sessions" className="gap-1.5 text-xs">
                        <Video className="h-3.5 w-3.5" /> Sessions
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="access-control" className="mt-6">
                    <L4GlobalAccessControl />
                </TabsContent>
                <TabsContent value="audit" className="mt-6">
                    <L4AuditVault />
                </TabsContent>
                <TabsContent value="sessions" className="mt-6">
                    <L4SessionRecorder />
                </TabsContent>
            </Tabs>
        </div>
    );
}
