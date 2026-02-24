"use client";

import { useState, useEffect } from "react";
import { AdminSession, AdminUser, AdminLevel } from "@/types";
import { getSessions, getAdminUsers } from "@/lib/data/admin-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell
} from "recharts";
import { Users, Activity, Clock } from "lucide-react";

const THROUGHPUT_DATA = [
    { name: 'Rahul S.', tickets: 14, color: '#3b82f6' },
    { name: 'Priya N.', tickets: 11, color: '#6366f1' },
    { name: 'Amit V.', tickets: 0, color: '#94a3b8' },
    { name: 'Alice E.', tickets: 7, color: '#10b981' },
    { name: 'Vikram S.', tickets: 9, color: '#0ea5e9' },
];

function formatDuration(minutes: number) {
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export function L3TeamMonitor() {
    const [sessions, setSessions] = useState<AdminSession[]>([]);
    const [staff, setStaff] = useState<AdminUser[]>([]);

    useEffect(() => {
        setSessions(getSessions());
        setStaff(getAdminUsers().filter(u =>
            [AdminLevel.LEVEL_1, AdminLevel.LEVEL_2].includes(u.role) && u.status === 'active'
        ));
        window.addEventListener('admin-store-update', () => {
            setStaff(getAdminUsers().filter(u =>
                [AdminLevel.LEVEL_1, AdminLevel.LEVEL_2].includes(u.role) && u.status === 'active'
            ));
        });
    }, []);

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                {[
                    {
                        title: 'Active Sessions', value: sessions.length.toString(),
                        sub: 'L1 & L2 currently online', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50'
                    },
                    {
                        title: 'Total Actions Today', value: sessions.reduce((a, s) => a + s.actionCount, 0).toString(),
                        sub: 'Across all active sessions', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50'
                    },
                    {
                        title: 'Avg Session Duration', value: sessions.length > 0
                            ? `${Math.round(sessions.reduce((a, s) => a + s.durationMinutes, 0) / sessions.length)}m`
                            : '—',
                        sub: 'Average across active sessions', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50'
                    },
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="pt-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-500 mb-1">{stat.title}</p>
                                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Active Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Active Sessions</CardTitle>
                    <CardDescription className="text-xs">Real-time overview of logged-in L1/L2 staff</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-slate-50">
                                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Admin</th>
                                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Level</th>
                                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Session Start</th>
                                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Duration</th>
                                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Actions</th>
                                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {sessions.map(session => (
                                <tr key={session.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                                                {session.adminName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <span className="font-medium text-slate-700 text-xs">{session.adminName}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded">
                                            {session.adminRole.replace('LEVEL_', 'L')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {new Date(session.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-600 font-medium">{formatDuration(session.durationMinutes)}</td>
                                    <td className="px-4 py-3 text-xs text-slate-600">{session.actionCount}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Ticket Throughput */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Ticket Throughput Today</CardTitle>
                    <CardDescription className="text-xs">Resolved tickets per agent</CardDescription>
                </CardHeader>
                <CardContent className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={THROUGHPUT_DATA} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} />
                            <XAxis type="number" fontSize={11} />
                            <YAxis dataKey="name" type="category" fontSize={11} tickLine={false} axisLine={false} width={70} />
                            <Tooltip />
                            <Bar dataKey="tickets" radius={[0, 4, 4, 0]} barSize={22}>
                                {THROUGHPUT_DATA.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
