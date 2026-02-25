"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminLevel } from "@/types";
import { Trophy, Zap, Clock, CheckCircle2, Bell, TrendingUp, AlertTriangle, TrendingDown } from "lucide-react";
import { DraftApplicationsPanel } from "./draft-applications-panel";
import { getL1KpiStats } from "@/constants/mock-data";
import { getCurrentUser } from "@/lib/auth/mock-auth";
import { useState, useEffect } from "react";

const efficiencyData = [
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 18 },
    { name: 'Wed', count: 15 },
    { name: 'Thu', count: 22 },
    { name: 'Fri', count: 20 },
];

const teamLeaderboard = [
    { name: 'Amit Kumar', count: 145, avatar: 'A' },
    { name: 'Priya Singh', count: 132, avatar: 'P' },
    { name: 'Suresh Raina', count: 128, avatar: 'S' },
    { name: 'Vikram Seth', count: 115, avatar: 'V' },
];

const COLORS = ['#0ea5e9', '#3b82f6', '#2563eb', '#1d4ed8'];

function NudgeScoreBadge({ score }: { score: number }) {
    if (score >= 70) return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm border border-emerald-200">
            <TrendingUp className="h-3.5 w-3.5" /> {score}/100 — Good
        </span>
    );
    if (score >= 40) return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold text-sm border border-amber-200">
            <TrendingUp className="h-3.5 w-3.5" /> {score}/100 — Needs Improvement
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-sm border border-red-200">
            <TrendingDown className="h-3.5 w-3.5" /> {score}/100 — At Risk
        </span>
    );
}

export function EfficiencyHub({ level }: { level: AdminLevel }) {
    const isL1 = level === AdminLevel.LEVEL_1;

    // `null` until mounted — avoids SSR/client mismatch since getCurrentUser reads localStorage
    const [kpi, setKpi] = useState<ReturnType<typeof getL1KpiStats> | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Safe to call now — we are definitely on the client
        const user = getCurrentUser();
        setUserId(user.id);
        if (isL1) {
            setKpi(getL1KpiStats(user.id));
        }
        const refresh = () => {
            const u = getCurrentUser();
            if (isL1) setKpi(getL1KpiStats(u.id));
        };
        window.addEventListener("app-store-update", refresh);
        return () => window.removeEventListener("app-store-update", refresh);
    }, [isL1]);

    // Suppress unused-variable lint — userId is derived for potential future use
    void userId;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Efficiency Hub</h2>
                    <p className="text-muted-foreground">
                        Track your processing metrics and team performance.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-100 italic font-medium">
                    <Trophy className="h-4 w-4" />
                    <span>You are #3 in Team Leaderboard!</span>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Apps Processed", value: "85", icon: CheckCircle2, sub: "+12% from last week", color: "text-green-600" },
                    { title: "Avg. Time", value: "24m", icon: Clock, sub: "-5m from last week", color: "text-blue-600" },
                    { title: "Efficiency Score", value: "94%", icon: Zap, sub: "Top 10% of team", color: "text-orange-600" },
                    { title: "Pending Queue", value: "12", icon: Clock, sub: "Next due in 2h", color: "text-slate-600" },
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={stat.color} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── L1 Draft Conversion KPI ─────────────────────────────────── */}
            {isL1 && kpi && (
                <Card className="border-blue-100 shadow-md shadow-blue-50/50 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-blue-800 flex items-center gap-2">
                                    <Bell className="h-4 w-4" />
                                    Draft Conversion KPI
                                </CardTitle>
                                <CardDescription className="text-xs text-blue-600 mt-1">
                                    Your performance nudging draft applicants to submission
                                </CardDescription>
                            </div>
                            <NudgeScoreBadge score={kpi.nudgeScore} />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-5">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="text-2xl font-black text-slate-800">{kpi.nudgedCount}</div>
                                <div className="text-[10px] font-semibold uppercase text-slate-500 mt-1">Drafts Nudged</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                                <div className="text-2xl font-black text-emerald-700">{kpi.convertedCount}</div>
                                <div className="text-[10px] font-semibold uppercase text-emerald-600 mt-1">Converted</div>
                            </div>
                            <div className={`text-center p-3 rounded-lg border ${kpi.penaltyCount > 0 ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-100"}`}>
                                <div className={`text-2xl font-black ${kpi.penaltyCount > 0 ? "text-red-600" : "text-slate-400"}`}>
                                    {kpi.penaltyCount}
                                </div>
                                <div className={`text-[10px] font-semibold uppercase mt-1 flex items-center justify-center gap-1 ${kpi.penaltyCount > 0 ? "text-red-500" : "text-slate-400"}`}>
                                    {kpi.penaltyCount > 0 && <AlertTriangle className="h-3 w-3" />}
                                    Low Quality Penalties
                                </div>
                            </div>
                        </div>
                        {kpi.penaltyCount > 0 && (
                            <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-red-700 leading-relaxed">
                                    You have <span className="font-bold">{kpi.penaltyCount} low-quality</span> mark{kpi.penaltyCount !== 1 ? "s" : ""} against applications you nudged.
                                    Each penalty reduces your Nudge Score by 2× the normal conversion weight.
                                    Focus on nudging only well-prepared applicants.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Workload Analysis</CardTitle>
                        <CardDescription>Applications processed daily this week</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={efficiencyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {efficiencyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Team Leaderboard</CardTitle>
                        <CardDescription>Top performers for {new Date().toLocaleString('default', { month: 'long' })}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {teamLeaderboard.map((user, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-700">
                                        {user.avatar}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">{user.count} points earned</p>
                                    </div>
                                    <div className="ml-auto font-medium">#{i + 1}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-lg">
                            <p className="text-xs text-orange-800 font-medium">
                                Keep processing to climb the leaderboard and earn &quot;Elite Scrutinizer&quot; badge!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Draft Applications Panel ────────────────────────────────── */}
            {isL1 && (
                <Card className="border-amber-100 shadow-md shadow-amber-50/50 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-amber-800 flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            Draft Applications — Nudge Queue
                        </CardTitle>
                        <CardDescription className="text-xs text-amber-700">
                            These applicants have started but not submitted. Nudge ready ones to complete their application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-5">
                        <DraftApplicationsPanel readOnly={false} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
