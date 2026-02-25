"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, Building2, CheckCircle, AlertTriangle, Medal, ShieldCheck, Star } from "lucide-react";
import { ApplicationTable } from "./application-table";
import { getAllL1KpiStats } from "@/constants/mock-data";
import { AdminLevel } from "@/types";
import { useState, useEffect } from "react";

const trendData = [
    { month: 'Jan', total: 450, approved: 380 },
    { month: 'Feb', total: 520, approved: 420 },
    { month: 'Mar', total: 610, approved: 490 },
    { month: 'Apr', total: 580, approved: 510 },
    { month: 'May', total: 720, approved: 590 },
    { month: 'Jun', total: 850, approved: 710 },
];

const statusDistribution = [
    { name: 'Approved', value: 710, color: '#10b981' },
    { name: 'Pending', value: 240, color: '#f59e0b' },
    { name: 'Rejected', value: 120, color: '#ef4444' },
];

function ScorePill({ score }: { score: number }) {
    if (score >= 70) return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200">
            <ShieldCheck className="h-3 w-3" /> {score}
        </span>
    );
    if (score >= 40) return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold text-xs border border-amber-200">
            <TrendingUp className="h-3 w-3" /> {score}
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-xs border border-red-200">
            <AlertTriangle className="h-3 w-3" /> {score}
        </span>
    );
}

const RANK_ICONS = [
    <Medal key="1" className="h-5 w-5 text-yellow-500" />,
    <Medal key="2" className="h-5 w-5 text-slate-400" />,
    <Medal key="3" className="h-5 w-5 text-amber-700" />,
];

export function CXODashboard() {
    // Client-only: getAllL1KpiStats reads in-memory store
    const [leaderboard, setLeaderboard] = useState<ReturnType<typeof getAllL1KpiStats>>([]);

    useEffect(() => {
        setLeaderboard(getAllL1KpiStats());
        const refresh = () => setLeaderboard(getAllL1KpiStats());
        window.addEventListener("app-store-update", refresh);
        return () => window.removeEventListener("app-store-update", refresh);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Executive Overview</h2>
                    <p className="text-muted-foreground">
                        Year-to-date performance and application trends.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Partners", value: "2,845", icon: Building2, trend: "+12.5%", color: "text-blue-600" },
                    { title: "Growth Rate", value: "18.2%", icon: TrendingUp, trend: "+2.4%", color: "text-emerald-600" },
                    { title: "Active Devices", value: "45.2M", icon: Users, trend: "+5.1%", color: "text-purple-600" },
                    { title: "Compliance Stat", value: "98.4%", icon: CheckCircle, trend: "+0.2%", color: "text-cyan-600" },
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={stat.color} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-emerald-600 font-medium">
                                {stat.trend} <span className="text-muted-foreground ml-1">from last period</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Application Growth Trend</CardTitle>
                        <CardDescription>Monthly submission vs approval volume</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                                <Area type="monotone" dataKey="approved" stroke="#10b981" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Partner Ecosystem Status</CardTitle>
                        <CardDescription>Current distribution of partner applications</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="w-full space-y-2 mt-4">
                            {statusDistribution.map((status, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                                        <span className="text-muted-foreground">{status.name}</span>
                                    </div>
                                    <span className="font-bold">{status.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── L1 Nudge Quality Leaderboard ──────────────────────────────── */}
            <Card className="border-indigo-100 shadow-md shadow-indigo-50/30 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <Star className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-indigo-900">
                                L1 Nudge Quality Leaderboard
                            </CardTitle>
                            <CardDescription className="text-xs text-indigo-600 mt-0.5">
                                Ranking of L1 officers by draft-to-submission conversion quality. Penalised for low-quality pushes.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-5">
                    {leaderboard.length === 0 ? (
                        <p className="text-center text-sm text-slate-400 py-8">No nudge activity recorded yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {/* Header row */}
                            <div className="grid grid-cols-6 gap-4 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <div className="col-span-2">Officer</div>
                                <div className="text-center">Nudged</div>
                                <div className="text-center">Converted</div>
                                <div className="text-center">Penalties</div>
                                <div className="text-center">Score</div>
                            </div>
                            {leaderboard.map((row, i) => (
                                <div
                                    key={row.l1Id}
                                    className={`grid grid-cols-6 gap-4 items-center px-4 py-3 rounded-xl border transition-colors ${i === 0 ? "bg-yellow-50/60 border-yellow-200" :
                                            i === 1 ? "bg-slate-50 border-slate-200" :
                                                i === 2 ? "bg-amber-50/40 border-amber-100" :
                                                    "bg-white border-slate-100"
                                        }`}
                                >
                                    <div className="col-span-2 flex items-center gap-3">
                                        <div className="shrink-0">
                                            {RANK_ICONS[i] ?? (
                                                <span className="h-5 w-5 flex items-center justify-center text-xs font-black text-slate-400">
                                                    #{i + 1}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 leading-tight">{row.l1Name}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">{row.l1Id}</p>
                                        </div>
                                    </div>
                                    <div className="text-center text-sm font-bold text-slate-700">{row.nudgedCount}</div>
                                    <div className="text-center text-sm font-bold text-emerald-700">{row.convertedCount}</div>
                                    <div className="text-center">
                                        {row.penaltyCount > 0 ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600">
                                                <AlertTriangle className="h-3 w-3" />{row.penaltyCount}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-300 font-medium">—</span>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <ScorePill score={row.nudgeScore} />
                                    </div>
                                </div>
                            ))}
                            <p className="text-[10px] text-slate-400 px-1 pt-1">
                                Score = max(0, (converted − penalties×2) ÷ nudged × 100). Updates live as L2 marks quality decisions.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Overall Partner Status</CardTitle>
                        <CardDescription>High-level summary of all applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ApplicationTable level={AdminLevel.LEVEL_4} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
