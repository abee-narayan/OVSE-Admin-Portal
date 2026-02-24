"use client";

import { useState, useEffect } from "react";
import { AdminSession, AdminLevel } from "@/types";
import { getSessions } from "@/lib/data/admin-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Video, Clock, Activity } from "lucide-react";

const LEVEL_LABELS: Record<string, string> = {
    [AdminLevel.LEVEL_1]: 'L1 – Support Desk',
    [AdminLevel.LEVEL_2]: 'L2 – Senior Support',
};

export function L4SessionRecorder() {
    const [sessions, setSessions] = useState<AdminSession[]>([]);
    const [playback, setPlayback] = useState<AdminSession | null>(null);

    useEffect(() => {
        setSessions(getSessions());
    }, []);

    return (
        <div className="space-y-4">
            <Card className="border-purple-200 bg-purple-50/30">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Video className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <CardTitle className="text-base text-purple-900">Session Recording</CardTitle>
                            <CardDescription className="text-xs text-purple-700">
                                Playback action logs for any L1/L2 admin session to investigate insider threats
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {sessions.map(session => (
                    <Card key={session.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                        {session.adminName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{session.adminName}</p>
                                        <p className="text-xs text-slate-500">{LEVEL_LABELS[session.adminRole] || session.adminRole}</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    className="bg-purple-600 hover:bg-purple-700 gap-1 shrink-0 text-xs"
                                    onClick={() => setPlayback(session)}
                                >
                                    <Video className="h-3.5 w-3.5" /> Playback
                                </Button>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                                <div className="bg-slate-50 rounded-lg py-2">
                                    <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-0.5">
                                        <Clock className="h-3 w-3" /> Duration
                                    </div>
                                    <p className="font-bold text-slate-700 text-sm">{session.durationMinutes}m</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg py-2">
                                    <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-0.5">
                                        <Activity className="h-3 w-3" /> Actions
                                    </div>
                                    <p className="font-bold text-slate-700 text-sm">{session.actionCount}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg py-2">
                                    <div className="text-slate-400 text-xs mb-0.5">Started</div>
                                    <p className="font-bold text-slate-700 text-xs">
                                        {new Date(session.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Playback Modal */}
            <Dialog open={!!playback} onOpenChange={open => !open && setPlayback(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Video className="h-5 w-5 text-purple-600" />
                            Session Playback — {playback?.adminName}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-1 mt-2">
                        <p className="text-xs text-slate-500 mb-4">
                            Session started {playback && new Date(playback.startTime).toLocaleString('en-IN')} · {playback?.durationMinutes} minutes · {playback?.actionCount} actions logged
                        </p>
                        <div className="relative pl-6 space-y-0">
                            {/* Timeline line */}
                            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-purple-100" />
                            {playback?.actionsLog.map((action, i) => (
                                <div key={i} className="relative pb-4">
                                    <div className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full bg-purple-400 border-2 border-white shadow-sm" />
                                    <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                                        <p className="text-[11px] text-slate-400 mb-0.5">
                                            {new Date(action.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </p>
                                        <p className="text-sm text-slate-700">{action.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
