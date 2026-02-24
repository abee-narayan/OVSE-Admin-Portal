"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminLevel } from "@/types";
import { Trophy, Zap, Clock, CheckCircle2 } from "lucide-react";


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

export function EfficiencyHub({ level }: { level: AdminLevel }) {
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
                                Keep processing to climb the leaderboard and earn "Elite Scrutinizer" badge!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
