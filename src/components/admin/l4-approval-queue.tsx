"use client";

import { useState, useEffect } from "react";
import { PendingUserChange, AdminLevel } from "@/types";
import { getPendingChanges, approveChange, rejectChange } from "@/lib/data/admin-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Clock, UserPlus, UserMinus, InboxIcon } from "lucide-react";

function formatTime(iso: string) {
    return new Date(iso).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

const ROLE_LABELS: Record<string, string> = {
    [AdminLevel.LEVEL_1]: 'L1 – Support Desk',
    [AdminLevel.LEVEL_2]: 'L2 – Senior Support',
};

export function L4ApprovalQueue() {
    const [changes, setChanges] = useState<PendingUserChange[]>([]);
    const [rejectTarget, setRejectTarget] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const refresh = () => setChanges(getPendingChanges().filter(c => c.status === 'pending'));

    useEffect(() => {
        refresh();
        window.addEventListener('admin-store-update', refresh);
        return () => window.removeEventListener('admin-store-update', refresh);
    }, []);

    const handleApprove = (id: string) => {
        approveChange(id);
    };

    const handleReject = () => {
        if (rejectTarget && rejectReason.trim()) {
            rejectChange(rejectTarget, rejectReason.trim());
            setRejectTarget(null);
            setRejectReason('');
        }
    };

    return (
        <div className="space-y-4">
            <Card className="border-amber-200 bg-amber-50/30">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Clock className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <CardTitle className="text-base text-amber-900">Pending Approvals</CardTitle>
                                <CardDescription className="text-xs text-amber-700">
                                    L3-initiated requests requiring your authorization (Four-Eyes Principle)
                                </CardDescription>
                            </div>
                        </div>
                        <span className="text-sm font-bold bg-amber-500 text-white rounded-full px-3 py-0.5">
                            {changes.length}
                        </span>
                    </div>
                </CardHeader>
            </Card>

            {changes.length === 0 ? (
                <Card className="py-16 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center">
                        <InboxIcon className="h-7 w-7 text-emerald-400" />
                    </div>
                    <p className="font-semibold text-slate-600">All caught up!</p>
                    <p className="text-sm text-slate-400">No pending requests from L3 at this time.</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {changes.map(change => (
                        <Card key={change.id} className="overflow-hidden">
                            <div className={`h-1 w-full ${change.type === 'ADD_USER' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            <CardContent className="pt-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${change.type === 'ADD_USER' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {change.type === 'ADD_USER' ? <UserPlus className="h-5 w-5" /> : <UserMinus className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${change.type === 'ADD_USER' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {change.type === 'ADD_USER' ? 'Add User' : 'Delete User'}
                                                </span>
                                                <span className="text-xs text-slate-400">Requested by {change.requestedByName}</span>
                                            </div>
                                            <p className="font-semibold text-slate-800 mt-1">{change.targetName}</p>
                                            <p className="text-xs text-slate-500">{change.targetEmail}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-500 shrink-0 space-y-1">
                                        <div>
                                            <span className="font-medium text-slate-600">Role: </span>
                                            {ROLE_LABELS[change.targetRole] || change.targetRole}
                                        </div>
                                        <div>
                                            <span className="font-medium text-slate-600">Dept: </span>
                                            {change.department}
                                        </div>
                                        <div className="text-xs text-slate-400">{formatTime(change.submittedAt)}</div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                                            onClick={() => handleApprove(change.id)}
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-red-300 text-red-600 hover:bg-red-50 gap-1"
                                            onClick={() => { setRejectTarget(change.id); setRejectReason(''); }}
                                        >
                                            <XCircle className="h-4 w-4" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Recently resolved */}
            <ResolvedQueue />

            {/* Rejection Dialog */}
            <Dialog open={!!rejectTarget} onOpenChange={open => !open && setRejectTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Request</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejection. This will be logged in the Audit Vault and visible to the requesting L3 admin.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="State your reason for rejection..."
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        rows={3}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700"
                            disabled={!rejectReason.trim()}
                            onClick={handleReject}
                        >
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ResolvedQueue() {
    const [resolved, setResolved] = useState<PendingUserChange[]>([]);

    const refresh = () => setResolved(
        getPendingChanges()
            .filter(c => c.status !== 'pending')
            .sort((a, b) => new Date(b.resolvedAt!).getTime() - new Date(a.resolvedAt!).getTime())
            .slice(0, 5)
    );

    useEffect(() => {
        refresh();
        window.addEventListener('admin-store-update', refresh);
        return () => window.removeEventListener('admin-store-update', refresh);
    }, []);

    if (resolved.length === 0) return null;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-500 font-medium">Recently Resolved</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-slate-50">
                            <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Target</th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Type</th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Decision</th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Resolved</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {resolved.map(r => (
                            <tr key={r.id} className="text-xs">
                                <td className="px-4 py-2 font-medium text-slate-700">{r.targetName}</td>
                                <td className="px-4 py-2 text-slate-500">{r.type === 'ADD_USER' ? 'Add User' : 'Delete User'}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-2 py-0.5 rounded font-semibold ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {r.status === 'approved' ? 'Approved' : 'Rejected'}
                                    </span>
                                    {r.rejectionReason && (
                                        <p className="text-slate-400 mt-0.5 italic">{r.rejectionReason}</p>
                                    )}
                                </td>
                                <td className="px-4 py-2 text-slate-400">
                                    {r.resolvedAt ? new Date(r.resolvedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
