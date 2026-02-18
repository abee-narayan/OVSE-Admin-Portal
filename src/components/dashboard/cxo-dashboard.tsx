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
import { TrendingUp, Users, Building2, CheckCircle, AlertCircle } from "lucide-react";
import { ApplicationTable } from "./application-table";
import { AdminLevel } from "@/types";

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

export function CXODashboard() {
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
                        <ResponsiveContainer width="100%" height="250px">
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
