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
import { Users, FileBarChart, LineChart, Target, FileEdit } from "lucide-react";
import { ApplicationTable } from "./application-table";
import { DraftApplicationsPanel } from "./draft-applications-panel";
import { AdminLevel } from "@/types";

const teamEfficiency = [
    { team: 'Team A (L1)', score: 92 },
    { team: 'Team B (L1)', score: 88 },
    { team: 'Team C (L2)', score: 95 },
    { team: 'Team D (L2)', score: 84 },
];

export function ReviewerDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Reviewer Overview</h2>
                    <p className="text-muted-foreground">
                        Monitor team output and application flow.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Team L1 Apps", value: "342", icon: Users, sub: "92 active today", color: "text-blue-600" },
                    { title: "L3 Pending Review", value: "48", icon: FileBarChart, sub: "12 high priority", color: "text-orange-600" },
                    { title: "Team Avg Score", value: "89%", icon: Target, sub: "+2% from yesterday", color: "text-emerald-600" },
                    { title: "Escalated Cases", value: "5", icon: LineChart, sub: "Needs AD attention", color: "text-red-500" },
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

            <Card>
                <CardHeader>
                    <CardTitle>Team Efficiency Tracker</CardTitle>
                    <CardDescription>Performance comparison across L1 and L2 teams</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={teamEfficiency} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="team" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={32}>
                                {teamEfficiency.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.score > 90 ? '#10b981' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Draft Applications Monitor — read-only for L3 */}
            <Card className="border-amber-100 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-amber-800 flex items-center gap-2">
                        <FileEdit className="h-4 w-4" />
                        Draft Applications Monitor
                    </CardTitle>
                    <CardDescription className="text-xs text-amber-700">
                        Oversight view — all applications by entities still in draft stage, and which L1 officers have nudged them.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-5">
                    <DraftApplicationsPanel readOnly={true} />
                </CardContent>
            </Card>

            <div className="pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Global Application Flow</CardTitle>
                        <CardDescription>Comprehensive view for Level 3 Reviewers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ApplicationTable level={AdminLevel.LEVEL_3} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
