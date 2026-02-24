"use client";

import { useState, useEffect } from "react";
import { AdminUser, AdminLevel, PendingUserChange } from "@/types";
import { getAdminUsers, getPendingChanges, submitPendingChange } from "@/lib/data/admin-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MfaBadge } from "./mfa-badge";
import { UserPlus, UserMinus, Clock, CheckCircle2, XCircle } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

const CURRENT_L3_USER = { id: 'l3-001', name: 'Bob Reviewer' };

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
};

export function L3UserDirectory() {
    const [staff, setStaff] = useState<AdminUser[]>([]);
    const [myChanges, setMyChanges] = useState<PendingUserChange[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', role: AdminLevel.LEVEL_1, department: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const refresh = () => {
        setStaff(getAdminUsers().filter(u =>
            [AdminLevel.LEVEL_1, AdminLevel.LEVEL_2].includes(u.role)
        ));
        setMyChanges(
            getPendingChanges().filter(c => c.requestedById === CURRENT_L3_USER.id)
        );
    };

    useEffect(() => {
        refresh();
        window.addEventListener('admin-store-update', refresh);
        return () => window.removeEventListener('admin-store-update', refresh);
    }, []);

    const handleAddSubmit = () => {
        if (!form.name || !form.email || !form.department) return;
        setSubmitting(true);
        setTimeout(() => {
            submitPendingChange({
                type: 'ADD_USER',
                requestedById: CURRENT_L3_USER.id,
                requestedByName: CURRENT_L3_USER.name,
                targetName: form.name,
                targetEmail: form.email,
                targetRole: form.role,
                department: form.department,
            });
            setSubmitting(false);
            setSubmitted(true);
            setShowForm(false);
            setForm({ name: '', email: '', role: AdminLevel.LEVEL_1, department: '' });
            setTimeout(() => setSubmitted(false), 3000);
        }, 800);
    };

    const handleOffboard = (user: AdminUser) => {
        submitPendingChange({
            type: 'DELETE_USER',
            requestedById: CURRENT_L3_USER.id,
            requestedByName: CURRENT_L3_USER.name,
            targetName: user.name,
            targetEmail: user.email,
            targetRole: user.role,
            department: user.department,
        });
    };

    return (
        <div className="space-y-6">
            {/* Add User */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-800">Staff Directory</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Changes require L4 authorization before taking effect</p>
                </div>
                <Button
                    className="gap-2 bg-blue-700 hover:bg-blue-800"
                    onClick={() => setShowForm(true)}
                >
                    <UserPlus className="h-4 w-4" />
                    Add User
                </Button>
            </div>

            {submitted && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-amber-700 text-sm">
                    <Clock className="h-4 w-4 shrink-0" />
                    Request submitted and is <strong className="mx-1">Pending L4 Approval</strong>. The user cannot log in until approved.
                </div>
            )}

            {/* Current Staff Table */}
            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-slate-50">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Name</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Level</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Department</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">MFA</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {staff.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800 text-xs">{user.name}</p>
                                                <p className="text-[11px] text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
                                            {user.role.replace('LEVEL_', 'L')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{user.department}</td>
                                    <td className="px-4 py-3"><MfaBadge mfaEnabled={user.mfaEnabled} mfaType={user.mfaType} /></td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-medium border px-2 py-0.5 rounded capitalize ${STATUS_COLORS[user.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-600 hover:bg-red-50 text-xs h-7 gap-1"
                                                >
                                                    <UserMinus className="h-3.5 w-3.5" /> Offboard
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Request Offboarding of {user.name}?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will submit a deletion request to L4 for authorization. {user.name} will remain active until the L4 approves.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleOffboard(user)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Submit for L4 Approval
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* My Pending Requests */}
            {myChanges.length > 0 && (
                <Card className="border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-600">My Submitted Requests</CardTitle>
                        <CardDescription className="text-xs">Track the status of your submissions</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-slate-50">
                                    <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Target</th>
                                    <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Type</th>
                                    <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Status</th>
                                    <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Submitted</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {myChanges.map(c => (
                                    <tr key={c.id} className="text-xs">
                                        <td className="px-4 py-2 font-medium text-slate-700">{c.targetName}</td>
                                        <td className="px-4 py-2 text-slate-500">{c.type === 'ADD_USER' ? 'Add User' : 'Delete User'}</td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-0.5 rounded border text-xs font-semibold ${STATUS_COLORS[c.status]}`}>
                                                {c.status === 'pending' ? '⏳ Pending L4 Approval' : c.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-slate-400">
                                            {new Date(c.submittedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}

            {/* Add User Dialog */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-blue-600" /> Add New User
                        </DialogTitle>
                        <DialogDescription>
                            This will create a request pending L4 approval. The user cannot access the system until approved.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="e.g. Sunita Gupta" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Official Email</Label>
                            <Input id="email" placeholder="name@uidai.gov.in" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Role</Label>
                            <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v as AdminLevel }))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={AdminLevel.LEVEL_1}>L1 – Support Desk</SelectItem>
                                    <SelectItem value={AdminLevel.LEVEL_2}>L2 – Senior Support</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="dept">Department</Label>
                            <Input id="dept" placeholder="e.g. Help Desk – West Zone" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                        <Button
                            className="bg-blue-700 hover:bg-blue-800"
                            disabled={!form.name || !form.email || !form.department || submitting}
                            onClick={handleAddSubmit}
                        >
                            {submitting ? 'Submitting...' : 'Submit for L4 Approval'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
