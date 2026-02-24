"use client";

import { useState, useEffect } from "react";
import { AdminUser, AdminLevel, PendingUserChange } from "@/types";
import {
    getAdminUsers, getPendingChanges, approveChange, rejectChange,
    setAdminStatus, addAdminUser
} from "@/lib/data/admin-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MfaBadge } from "./mfa-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
    CheckCircle2, XCircle, Clock, UserPlus, UserMinus, Users, ClipboardList
} from "lucide-react";

const STATUS_PILL: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
};

const USER_STATUS_PILL: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    disabled: "bg-slate-100 text-slate-500 border-slate-200",
    frozen: "bg-blue-50 text-blue-700 border-blue-100",
    pending: "bg-amber-50 text-amber-700 border-amber-100",
};

export function L4UserManagement() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [pending, setPending] = useState<PendingUserChange[]>([]);
    const [resolved, setResolved] = useState<PendingUserChange[]>([]);
    const [rejectTarget, setRejectTarget] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [addForm, setAddForm] = useState({ name: "", email: "", role: AdminLevel.LEVEL_1, department: "" });
    const [adding, setAdding] = useState(false);

    const refresh = () => {
        const all = getAdminUsers();
        setUsers(all.filter(u => [AdminLevel.LEVEL_1, AdminLevel.LEVEL_2, AdminLevel.LEVEL_3].includes(u.role)));
        const changes = getPendingChanges();
        setPending(changes.filter(c => c.status === "pending"));
        setResolved(changes.filter(c => c.status !== "pending").slice(0, 10));
    };

    useEffect(() => {
        refresh();
        window.addEventListener("admin-store-update", refresh);
        return () => window.removeEventListener("admin-store-update", refresh);
    }, []);

    const handleApprove = (id: string) => approveChange(id, "Director General");

    const handleReject = () => {
        if (rejectTarget && rejectReason.trim()) {
            rejectChange(rejectTarget, rejectReason.trim(), "Director General");
            setRejectTarget(null);
            setRejectReason("");
        }
    };

    const handleToggle = (user: AdminUser) => {
        setAdminStatus(user.id, user.status === "disabled" ? "active" : "disabled", "Director General");
    };

    const handleDirectAdd = () => {
        if (!addForm.name || !addForm.email || !addForm.department) return;
        setAdding(true);
        setTimeout(() => {
            addAdminUser({
                name: addForm.name,
                email: addForm.email,
                role: addForm.role,
                department: addForm.department,
            });
            setAdding(false);
            setShowAddDialog(false);
            setAddForm({ name: "", email: "", role: AdminLevel.LEVEL_1, department: "" });
        }, 600);
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="approvals">
                <div className="flex items-center justify-between mb-4">
                    <TabsList className="grid grid-cols-2 w-72">
                        <TabsTrigger value="approvals" className="gap-1.5 text-xs">
                            <ClipboardList className="h-3.5 w-3.5" />
                            Approval Queue
                            {pending.length > 0 && (
                                <span className="ml-1 bg-amber-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                                    {pending.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="users" className="gap-1.5 text-xs">
                            <Users className="h-3.5 w-3.5" /> All Users
                        </TabsTrigger>
                    </TabsList>
                    <Button
                        className="bg-blue-700 hover:bg-blue-800 gap-2"
                        size="sm"
                        onClick={() => setShowAddDialog(true)}
                    >
                        <UserPlus className="h-4 w-4" /> Add User Directly
                    </Button>
                </div>

                {/* ── TAB 1: APPROVAL QUEUE ── */}
                <TabsContent value="approvals" className="space-y-4">
                    <p className="text-xs text-slate-500">
                        L3 Operations Leads submit user add/delete requests here. As L4 Super Admin you have final authority.
                    </p>

                    {pending.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
                            <CheckCircle2 className="h-10 w-10 text-emerald-300" />
                            <p className="text-sm font-medium">No pending requests — all clear.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pending.map(req => (
                                <Card key={req.id} className="border-l-4 border-l-amber-400 shadow-sm">
                                    <CardContent className="pt-4 pb-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${req.type === "ADD_USER" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                                                        {req.type === "ADD_USER" ? "ADD USER" : "DELETE USER"}
                                                    </span>
                                                    <span className="font-semibold text-slate-800">{req.targetName}</span>
                                                </div>
                                                <p className="text-xs text-slate-500">
                                                    {req.targetEmail} · {req.targetRole.replace("LEVEL_", "L")} · {req.department}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    Requested by <span className="font-medium text-slate-600">{req.requestedByName}</span> (L3) ·{" "}
                                                    {new Date(req.submittedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Button
                                                    size="sm"
                                                    className="bg-emerald-600 hover:bg-emerald-700 gap-1.5 text-xs"
                                                    onClick={() => handleApprove(req.id)}
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-200 text-red-600 hover:bg-red-50 gap-1.5 text-xs"
                                                    onClick={() => setRejectTarget(req.id)}
                                                >
                                                    <XCircle className="h-3.5 w-3.5" /> Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Resolved history */}
                    {resolved.length > 0 && (
                        <div className="pt-2">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Recently Resolved</p>
                            <div className="space-y-2">
                                {resolved.map(req => (
                                    <div key={req.id} className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-50 border">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-700">{req.targetName}</span>
                                            <span className="text-slate-400">·</span>
                                            <span className="text-slate-500">{req.type === "ADD_USER" ? "Add" : "Delete"}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${STATUS_PILL[req.status]}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* ── TAB 2: ALL USERS ── */}
                <TabsContent value="users">
                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-slate-50">
                                        {["Name", "Level", "Department", "MFA", "Status", "Action"].map(h => (
                                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                                        {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800 text-xs">{user.name}</p>
                                                        <p className="text-[11px] text-slate-400">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
                                                    {user.role.replace("LEVEL_", "L")}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-500">{user.department}</td>
                                            <td className="px-4 py-3">
                                                <MfaBadge mfaEnabled={user.mfaEnabled} mfaType={user.mfaType} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-medium border px-2 py-0.5 rounded capitalize ${USER_STATUS_PILL[user.status] || ""}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className={`text-xs h-7 ${user.status === "disabled" ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-500 hover:bg-slate-100"}`}
                                                        onClick={() => handleToggle(user)}
                                                        disabled={user.status === "frozen"}
                                                    >
                                                        {user.status === "disabled" ? "Enable" : "Disable"}
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 text-xs h-7 gap-1">
                                                                <UserMinus className="h-3 w-3" /> Remove
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Remove {user.name}?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    As L4 Super Admin, this action takes effect immediately with no approval step. The user will lose all access.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                    onClick={() => setAdminStatus(user.id, "disabled", "Director General")}
                                                                >
                                                                    Remove Immediately
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Reject reason dialog */}
            <Dialog open={!!rejectTarget} onOpenChange={() => { setRejectTarget(null); setRejectReason(""); }}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <XCircle className="h-5 w-5" /> Reject Request
                        </DialogTitle>
                        <DialogDescription>Provide a reason. This will be logged and visible to the requester.</DialogDescription>
                    </DialogHeader>
                    <textarea
                        className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-200"
                        rows={3}
                        placeholder="Reason for rejection..."
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
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

            {/* Direct Add User dialog (L4 — immediate, no approval) */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-blue-600" /> Add User — L4 Direct Authority
                        </DialogTitle>
                        <DialogDescription>
                            As Super Admin, this user is created <strong>immediately</strong> with no approval step.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Full Name</Label>
                            <Input placeholder="e.g. Sunita Gupta" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Official Email</Label>
                            <Input placeholder="name@uidai.gov.in" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Role</Label>
                            <Select value={addForm.role} onValueChange={v => setAddForm(f => ({ ...f, role: v as AdminLevel }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={AdminLevel.LEVEL_1}>L1 – Support Desk</SelectItem>
                                    <SelectItem value={AdminLevel.LEVEL_2}>L2 – Senior Support</SelectItem>
                                    <SelectItem value={AdminLevel.LEVEL_3}>L3 – Operations Lead</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Department</Label>
                            <Input placeholder="e.g. Help Desk – North Zone" value={addForm.department} onChange={e => setAddForm(f => ({ ...f, department: e.target.value }))} />
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs text-blue-700">
                            This action is immediately effective and will be recorded in the Audit Vault.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                        <Button
                            className="bg-blue-700 hover:bg-blue-800"
                            disabled={!addForm.name || !addForm.email || !addForm.department || adding}
                            onClick={handleDirectAdd}
                        >
                            {adding ? "Creating..." : "Create User Now"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
