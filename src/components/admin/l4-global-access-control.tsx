"use client";

import { useState, useEffect } from "react";
import { AdminLevel, AdminUser, AdminUserStatus } from "@/types";
import {
    getAdminUsers, setAdminStatus, freezeTier, unfreezeTier
} from "@/lib/data/admin-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { MfaBadge } from "./mfa-badge";
import { Snowflake, ShieldOff, ShieldCheck, Zap } from "lucide-react";

const TIER_LABELS: Record<string, string> = {
    [AdminLevel.LEVEL_1]: 'L1 – Support Desk',
    [AdminLevel.LEVEL_2]: 'L2 – Senior Support',
    [AdminLevel.LEVEL_3]: 'L3 – Operations Lead',
};

const STATUS_COLORS: Record<AdminUserStatus, string> = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    disabled: 'bg-slate-100 text-slate-500 border-slate-200',
    frozen: 'bg-blue-100 text-blue-700 border-blue-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
};

function formatRelativeTime(iso: string) {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hrs = Math.floor(diff / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export function L4GlobalAccessControl() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [frozenTiers, setFrozenTiers] = useState<Set<AdminLevel>>(new Set());

    const refresh = () => {
        const all = getAdminUsers().filter(u =>
            [AdminLevel.LEVEL_1, AdminLevel.LEVEL_2, AdminLevel.LEVEL_3].includes(u.role)
        );
        setUsers(all);
        const frozen = new Set<AdminLevel>();
        if (all.filter(u => u.role === AdminLevel.LEVEL_1).every(u => u.status === 'frozen'))
            frozen.add(AdminLevel.LEVEL_1);
        if (all.filter(u => u.role === AdminLevel.LEVEL_2).every(u => u.status === 'frozen'))
            frozen.add(AdminLevel.LEVEL_2);
        if (all.filter(u => u.role === AdminLevel.LEVEL_3).every(u => u.status === 'frozen'))
            frozen.add(AdminLevel.LEVEL_3);
        setFrozenTiers(frozen);
    };

    useEffect(() => {
        refresh();
        window.addEventListener('admin-store-update', refresh);
        return () => window.removeEventListener('admin-store-update', refresh);
    }, []);

    const handleToggle = (user: AdminUser) => {
        setAdminStatus(user.id, user.status === 'disabled' ? 'active' : 'disabled');
    };

    const handleFreeze = (tier: AdminLevel) => {
        if (frozenTiers.has(tier)) {
            unfreezeTier(tier);
        } else {
            freezeTier(tier);
        }
    };

    return (
        <div className="space-y-6">
            {/* Emergency Freeze */}
            <Card className="border-red-200 bg-red-50/40">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Zap className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <CardTitle className="text-red-800 text-base">Emergency Freeze</CardTitle>
                            <CardDescription className="text-red-600/80 text-xs">
                                Instantly revoke all active sessions for an entire access tier
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {([AdminLevel.LEVEL_1, AdminLevel.LEVEL_2, AdminLevel.LEVEL_3] as AdminLevel[]).map(tier => {
                            const isFrozen = frozenTiers.has(tier);
                            return (
                                <AlertDialog key={tier}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant={isFrozen ? "outline" : "destructive"}
                                            className={isFrozen
                                                ? "border-blue-300 text-blue-700 hover:bg-blue-50 gap-2"
                                                : "gap-2 bg-red-600 hover:bg-red-700"
                                            }
                                        >
                                            <Snowflake className="h-4 w-4" />
                                            {isFrozen ? `Unfreeze ${tier.replace('LEVEL_', 'L')}` : `Freeze ${tier.replace('LEVEL_', 'L')} Access`}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                {isFrozen ? `Lift freeze on ${TIER_LABELS[tier]}?` : `Freeze ${TIER_LABELS[tier]}?`}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {isFrozen
                                                    ? `This will restore access for all ${TIER_LABELS[tier]} accounts currently frozen.`
                                                    : `This will immediately revoke all active sessions and block login for every ${TIER_LABELS[tier]} account. This action is logged in the Audit Vault.`
                                                }
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleFreeze(tier)}
                                                className={isFrozen ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}
                                            >
                                                {isFrozen ? 'Confirm: Lift Freeze' : 'Confirm: Emergency Freeze'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Admin Status Table */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-base">Admin Account Status</CardTitle>
                            <CardDescription className="text-xs">
                                Toggle access for individual L1–L3 admins
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-slate-50/80">
                                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Level</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Department</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-600">MFA</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Last Active</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{user.name}</p>
                                                    <p className="text-xs text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                                                {user.role.replace('LEVEL_', 'L')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 text-xs">{user.department}</td>
                                        <td className="px-4 py-3">
                                            <MfaBadge mfaEnabled={user.mfaEnabled} mfaType={user.mfaType} />
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{formatRelativeTime(user.lastActive)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-medium border px-2 py-0.5 rounded capitalize ${STATUS_COLORS[user.status]}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant={user.status === 'disabled' ? 'outline' : 'ghost'}
                                                        className={
                                                            user.status === 'disabled'
                                                                ? 'text-emerald-700 border-emerald-300 hover:bg-emerald-50 text-xs h-7'
                                                                : 'text-red-600 hover:bg-red-50 text-xs h-7'
                                                        }
                                                        disabled={user.status === 'frozen'}
                                                    >
                                                        {user.status === 'disabled' ? (
                                                            <><ShieldCheck className="h-3 w-3 mr-1" />Enable</>
                                                        ) : (
                                                            <><ShieldOff className="h-3 w-3 mr-1" />Disable</>
                                                        )}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            {user.status === 'disabled' ? 'Enable' : 'Disable'} {user.name}?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            {user.status === 'disabled'
                                                                ? `This will restore login access for ${user.name}.`
                                                                : `This will immediately revoke ${user.name}'s access. They will be unable to log in. This action is logged.`
                                                            }
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleToggle(user)}>
                                                            Confirm
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
