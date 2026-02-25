"use client";

import { useState, useEffect } from "react";
import { Application, ApplicationStatus, AdminLevel } from "@/types";
import {
    getDraftApplications,
    nudgeDraftApplicant,
    subscribeApplications,
} from "@/constants/mock-data";
import { getCurrentUser } from "@/lib/auth/mock-auth";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";

function draftAge(draftStartedAt?: string): string {
    if (!draftStartedAt) return "—";
    const ms = Date.now() - new Date(draftStartedAt).getTime();
    const days = Math.floor(ms / 86400000);
    if (days === 0) return "Today";
    return `${days}d ago`;
}

function draftAgeClass(draftStartedAt?: string): string {
    if (!draftStartedAt) return "";
    const ms = Date.now() - new Date(draftStartedAt).getTime();
    const days = Math.floor(ms / 86400000);
    if (days >= 7) return "text-red-600 font-semibold";
    if (days >= 3) return "text-amber-600 font-medium";
    return "text-emerald-600";
}

interface Props {
    /** If true the panel is read-only (for L3/L4 visibility). L1 can nudge. */
    readOnly?: boolean;
    /** Show only a specified number of rows (for dashboard widgets) */
    limit?: number;
}

export function DraftApplicationsPanel({ readOnly = false, limit }: Props) {
    const user = getCurrentUser();
    const [draftApps, setDraftApps] = useState<Application[]>(() => getDraftApplications());
    const [nudgingId, setNudgingId] = useState<string | null>(null);
    const [nudgedNow, setNudgedNow] = useState<Set<string>>(new Set());

    useEffect(() => {
        const unsub = subscribeApplications(() => setDraftApps(getDraftApplications()));
        return unsub;
    }, []);

    useEffect(() => {
        const handler = () => setDraftApps(getDraftApplications());
        window.addEventListener("app-store-update", handler);
        return () => window.removeEventListener("app-store-update", handler);
    }, []);

    const visible = limit ? draftApps.slice(0, limit) : draftApps;

    const handleNudge = (app: Application) => {
        setNudgingId(app.id);
        setTimeout(() => {
            nudgeDraftApplicant(app.id, user.id, user.name);
            setNudgedNow(prev => new Set(prev).add(app.id));
            setNudgingId(null);
        }, 600);
    };

    const isAlreadyNudgedByMe = (app: Application) =>
        app.nudgedByL1Id === user.id || nudgedNow.has(app.id);

    if (draftApps.length === 0) {
        return (
            <div className="flex items-center justify-center py-10 text-slate-400 text-sm gap-2">
                <CheckCircle2 className="h-4 w-4" />
                No draft applications pending.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {!readOnly && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                        <span className="font-semibold">KPI Warning:</span> Nudging applicants with poor or
                        incomplete applications will negatively impact your Nudge Score if L2 marks the
                        submission as <span className="font-semibold">Low Quality</span>. Only nudge genuinely
                        ready applicants.
                    </p>
                </div>
            )}

            <div className="rounded-md border bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead className="w-[100px]">App ID</TableHead>
                            <TableHead>Organisation</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Draft Age</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Nudged By</TableHead>
                            {!readOnly && <TableHead className="text-right">Action</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visible.map(app => {
                            const isLowQuality = app.status === ApplicationStatus.LOW_QUALITY;
                            const nudgedByMe = isAlreadyNudgedByMe(app);
                            const nudgedByOther = !!app.nudgedByL1Id && !nudgedByMe;

                            return (
                                <TableRow
                                    key={app.id}
                                    className={isLowQuality ? "bg-red-50/40" : undefined}
                                >
                                    <TableCell className="font-medium text-xs">{app.id}</TableCell>
                                    <TableCell className="font-medium">{app.entityName}</TableCell>
                                    <TableCell className="text-sm text-slate-500">{app.entityCategory || "—"}</TableCell>
                                    <TableCell>
                                        <span className={`text-xs flex items-center gap-1 ${draftAgeClass(app.draftStartedAt)}`}>
                                            <Clock className="h-3 w-3" />
                                            {draftAge(app.draftStartedAt)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {isLowQuality ? (
                                            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 text-[10px]">
                                                LOW QUALITY
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                                                DRAFT
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {app.nudgedByL1Name ? (
                                            <span className={`text-xs flex items-center gap-1 ${nudgedByMe ? "text-blue-700 font-medium" : "text-slate-500"}`}>
                                                <Bell className="h-3 w-3" />
                                                {nudgedByMe ? "You" : app.nudgedByL1Name}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-300 flex items-center gap-1">
                                                <BellOff className="h-3 w-3" /> Not nudged
                                            </span>
                                        )}
                                    </TableCell>
                                    {!readOnly && (
                                        <TableCell className="text-right">
                                            {isLowQuality ? (
                                                <span className="text-[10px] text-red-500 font-medium">
                                                    KPI –1 Penalty
                                                </span>
                                            ) : nudgedByMe ? (
                                                <span className="text-[10px] text-blue-600 font-medium flex items-center justify-end gap-1">
                                                    <CheckCircle2 className="h-3 w-3" /> Nudged
                                                </span>
                                            ) : nudgedByOther ? (
                                                <span className="text-[10px] text-slate-400">Already nudged</span>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs h-7 border-blue-200 text-blue-700 hover:bg-blue-50"
                                                    disabled={nudgingId === app.id}
                                                    onClick={() => handleNudge(app)}
                                                >
                                                    <Bell className="h-3 w-3 mr-1" />
                                                    {nudgingId === app.id ? "Sending…" : "Nudge"}
                                                </Button>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            <p className="text-xs text-slate-400 px-1">
                Showing {visible.length} of {draftApps.length} draft application{draftApps.length !== 1 ? "s" : ""}
            </p>
        </div>
    );
}
