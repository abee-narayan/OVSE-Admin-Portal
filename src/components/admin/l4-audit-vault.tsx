"use client";

import { useState, useEffect, useMemo } from "react";
import { AuditLogEntry, AuditSeverity, AdminLevel } from "@/types";
import { getAuditLogs } from "@/lib/data/admin-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Search } from "lucide-react";

const SEVERITY_STYLES: Record<AuditSeverity, string> = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
};

const LEVEL_LABELS: Record<string, string> = {
    [AdminLevel.LEVEL_1]: 'L1',
    [AdminLevel.LEVEL_2]: 'L2',
    [AdminLevel.LEVEL_3]: 'L3',
    [AdminLevel.LEVEL_4]: 'L4',
};

const ACTION_LABELS: Record<string, string> = {
    APPROVED_USER_ADD: 'Approved Add User',
    APPROVED_USER_DELETE: 'Approved Delete User',
    REJECTED_USER_CHANGE: 'Rejected Request',
    SUBMITTED_ADD_USER: 'Submitted Add User',
    SUBMITTED_DELETE_USER: 'Submitted Delete User',
    DISABLED_ADMIN: 'Disabled Admin',
    ENABLED_ADMIN: 'Enabled Admin',
    EMERGENCY_FREEZE: 'Emergency Freeze',
    LIFT_FREEZE: 'Lift Freeze',
    JIT_ELEVATION_REQUESTED: 'JIT Elevation',
    LOGIN: 'Login',
    TICKET_RESOLVED: 'Ticket Resolved',
    POLICY_UPDATE: 'Policy Update',
};

export function L4AuditVault() {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [search, setSearch] = useState('');
    const [severityFilter, setSeverityFilter] = useState<string>('all');

    const refresh = () => setLogs(getAuditLogs());

    useEffect(() => {
        refresh();
        window.addEventListener('admin-store-update', refresh);
        return () => window.removeEventListener('admin-store-update', refresh);
    }, []);

    const filtered = useMemo(() => {
        return logs.filter(log => {
            const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
            const q = search.toLowerCase();
            const matchesSearch = !q ||
                log.actorName.toLowerCase().includes(q) ||
                log.action.toLowerCase().includes(q) ||
                (log.targetName?.toLowerCase().includes(q)) ||
                log.details.toLowerCase().includes(q);
            return matchesSeverity && matchesSearch;
        });
    }, [logs, search, severityFilter]);

    return (
        <div className="space-y-4">
            <Card className="border-slate-200 bg-slate-50/50">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-slate-900 rounded-lg">
                            <Lock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-base">Audit Vault</CardTitle>
                            <CardDescription className="text-xs">
                                Immutable, tamper-evident log of all L3 and L4 administrative actions
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3 flex-wrap">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search logs..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 text-sm"
                            />
                        </div>
                        <Select value={severityFilter} onValueChange={setSeverityFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Severity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Severity</SelectItem>
                                <SelectItem value="info">Info</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-slate-50">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 w-36">Timestamp</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Actor</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 w-10">Lvl</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Action</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Target</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Details</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 w-20">Severity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                                            {new Date(log.timestamp).toLocaleString('en-IN', {
                                                day: '2-digit', month: 'short',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-slate-700 text-xs">{log.actorName}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-bold text-blue-600">{LEVEL_LABELS[log.actorLevel]}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                                {ACTION_LABELS[log.action] || log.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{log.targetName || '—'}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500 max-w-xs">{log.details}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold border px-2 py-0.5 rounded capitalize ${SEVERITY_STYLES[log.severity]}`}>
                                                {log.severity}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-14 text-center text-slate-400 text-sm">
                                            No log entries match your filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-4 py-2 border-t bg-slate-50 text-xs text-slate-400 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Audit Vault entries are immutable and cannot be edited or deleted.
                        {filtered.length} / {logs.length} entries shown.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
