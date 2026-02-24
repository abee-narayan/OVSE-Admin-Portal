"use client";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { L3UserDirectory } from "./l3-user-directory";
import { L3TeamMonitor } from "./l3-team-monitor";
import { Users, Activity } from "lucide-react";

export function L3Dashboard() {
    return (
        <div className="space-y-6">
            {/* Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden min-h-[170px] flex items-center">
                <Image
                    src="/hero-bg.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="relative z-10 flex items-center justify-between w-full px-10 py-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-orange-700 mb-1">L3 Operations Lead</p>
                        <h2 className="text-2xl font-bold text-slate-800 leading-tight">User Lifecycle Management</h2>
                        <p className="text-slate-600 text-sm mt-1 max-w-lg">
                            Initiate user additions or removals. All changes enter a pending state and require L4 Super Admin authorization before taking effect.
                        </p>
                    </div>
                    <div className="hidden md:block shrink-0 relative h-32 w-32">
                        <Image
                            src="/hero-mascot.png"
                            alt="Aadhaar Mascot"
                            fill
                            className="object-contain drop-shadow-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="directory">
                <TabsList className="grid grid-cols-2 w-full max-w-xs">
                    <TabsTrigger value="directory" className="gap-1.5 text-xs">
                        <Users className="h-3.5 w-3.5" /> User Directory
                    </TabsTrigger>
                    <TabsTrigger value="monitor" className="gap-1.5 text-xs">
                        <Activity className="h-3.5 w-3.5" /> Team Monitor
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="directory" className="mt-6">
                    <L3UserDirectory />
                </TabsContent>
                <TabsContent value="monitor" className="mt-6">
                    <L3TeamMonitor />
                </TabsContent>
            </Tabs>
        </div>
    );
}
