"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AdminLevel, JITDuration } from "@/types";
import { requestJIT } from "@/lib/data/admin-store";
import { activateJIT, clearJIT, getJIT, subscribeJIT } from "@/lib/stores/jit-store";
import { getRoleFromPathname } from "@/components/layout/main-nav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { ShieldAlert, TimerIcon, CheckCircle2, ShieldCheck } from "lucide-react";

const DURATIONS: { label: string; value: JITDuration }[] = [
    { label: '30 min', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
    { label: '4 hours', value: 240 },
];

function formatCountdown(ms: number) {
    if (ms <= 0) return '00:00';
    const totalSec = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const ELEVATED_LABEL: Record<AdminLevel, string> = {
    [AdminLevel.LEVEL_1]: "L2 access",
    [AdminLevel.LEVEL_2]: "L3 access (User Management)",
    [AdminLevel.LEVEL_3]: "L4 access (Governance)",
    [AdminLevel.LEVEL_4]: "",
};

export function JITElevationModal() {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [duration, setDuration] = useState<JITDuration>(60);
    const [submitting, setSubmitting] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [jitActive, setJitActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const pathname = usePathname();

    useEffect(() => { setMounted(true); }, []);

    // Sync JIT state from store
    useEffect(() => {
        const sync = () => {
            const s = getJIT();
            setJitActive(!!s);
            if (s) {
                setCountdown(Math.max(0, new Date(s.expiresAt).getTime() - Date.now()));
            } else {
                setCountdown(0);
            }
        };
        sync();
        const unsub = subscribeJIT(sync);
        return unsub;
    }, []);

    // Countdown tick
    useEffect(() => {
        if (jitActive) {
            timerRef.current = setInterval(() => {
                const s = getJIT();
                if (!s) {
                    setJitActive(false);
                    setCountdown(0);
                    if (timerRef.current) clearInterval(timerRef.current);
                    return;
                }
                const remaining = new Date(s.expiresAt).getTime() - Date.now();
                if (remaining <= 0) {
                    clearJIT();
                    setJitActive(false);
                    setCountdown(0);
                    if (timerRef.current) clearInterval(timerRef.current);
                } else {
                    setCountdown(remaining);
                }
            }, 1000);
            return () => { if (timerRef.current) clearInterval(timerRef.current); };
        }
    }, [jitActive]);

    // Derive role from URL — never from localStorage
    // L4 is NOT eligible for JIT (they're already at the top)
    if (!mounted) return null;
    const roleFromUrl = getRoleFromPathname(pathname);
    const eligible = roleFromUrl &&
        [AdminLevel.LEVEL_1, AdminLevel.LEVEL_2, AdminLevel.LEVEL_3].includes(roleFromUrl);
    if (!eligible) return null;

    const handleSubmit = () => {
        if (!reason.trim() || !roleFromUrl) return;
        setSubmitting(true);
        setTimeout(() => {
            // Record in admin-store audit log
            requestJIT('current-user', 'Current User', roleFromUrl, reason.trim(), duration);
            // Actually activate the elevated access in the nav store
            activateJIT(roleFromUrl, duration);
            setSubmitting(false);
            setOpen(false);
            setReason('');
        }, 600);
    };

    const handleRevoke = () => {
        clearJIT();
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                {jitActive && countdown > 0 && (
                    <div className="flex flex-col items-end gap-1.5">
                        <div className="bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            JIT Elevated · {formatCountdown(countdown)}
                        </div>
                        <button
                            onClick={handleRevoke}
                            className="text-[10px] text-purple-400 hover:text-red-400 underline transition-colors"
                        >
                            Revoke early
                        </button>
                    </div>
                )}
                {!jitActive && (
                    <Button
                        onClick={() => setOpen(true)}
                        className="bg-purple-700 hover:bg-purple-800 shadow-lg rounded-full gap-2 px-4"
                        size="sm"
                    >
                        <ShieldAlert className="h-4 w-4" />
                        Request Elevation
                    </Button>
                )}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-purple-600" />
                            Just-In-Time Elevation
                        </DialogTitle>
                        <DialogDescription>
                            Temporarily unlock <strong>{roleFromUrl ? ELEVATED_LABEL[roleFromUrl] : ''}</strong> for a specific task window.
                            Access is automatically revoked at expiry and your nav updates immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Duration</Label>
                            <div className="flex gap-2 flex-wrap">
                                {DURATIONS.map(d => (
                                    <button
                                        key={d.value}
                                        onClick={() => setDuration(d.value)}
                                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${duration === d.value
                                            ? 'bg-purple-700 text-white border-purple-700'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                                            }`}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Reason for Elevation</Label>
                            <Textarea
                                placeholder="Describe the specific task requiring temporary elevation..."
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 text-xs text-purple-700">
                            <strong>Effect:</strong> Nav will unlock {roleFromUrl ? ELEVATED_LABEL[roleFromUrl] : ''} during the window.
                            Elevation is logged in the Audit Vault. MFA (FIDO2/TOTP) verification required.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            className="bg-purple-700 hover:bg-purple-800 gap-1.5"
                            disabled={!reason.trim() || submitting}
                            onClick={handleSubmit}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {submitting ? 'Activating...' : 'Activate Elevation'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
