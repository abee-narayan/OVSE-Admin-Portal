"use client";

import { useState, useEffect } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApplications, subscribeApplications } from "@/constants/mock-data";
import { Application, ApplicationStatus, AdminLevel } from "@/types";
import { Eye, Search, Filter } from "lucide-react";
import { ApplicationReviewDetail } from "./application-review-detail";

const statusColors: Record<ApplicationStatus, string> = {
    [ApplicationStatus.DRAFT]: "bg-amber-50 text-amber-700 border-amber-200",
    [ApplicationStatus.SUBMITTED]: "bg-orange-100 text-orange-700 border-orange-200",
    [ApplicationStatus.L1_REJECTED]: "bg-red-100 text-red-700 border-red-200",
    [ApplicationStatus.L1_APPROVED]: "bg-blue-100 text-blue-700 border-blue-200",
    [ApplicationStatus.L2_REJECTED]: "bg-red-100 text-red-800 border-red-300",
    [ApplicationStatus.LOW_QUALITY]: "bg-red-200 text-red-900 border-red-400",
    [ApplicationStatus.L2_APPROVED]: "bg-cyan-100 text-cyan-700 border-cyan-200",
    [ApplicationStatus.ACTIVE]: "bg-emerald-100 text-emerald-700 border-emerald-200",
    [ApplicationStatus.REVOKED]: "bg-rose-100 text-rose-700 border-rose-200",
};

export function ApplicationTable({ level }: { level: AdminLevel }) {
    const [apps, setApps] = useState<Application[]>(() => getApplications());
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [search, setSearch] = useState("");

    // Re-render whenever the store is updated (after approve/reject)
    useEffect(() => {
        const unsub = subscribeApplications(() => setApps(getApplications()));
        return unsub;
    }, []);

    // Also listen for the window event (cross-component)
    useEffect(() => {
        const handler = () => setApps(getApplications());
        window.addEventListener("app-store-update", handler);
        return () => window.removeEventListener("app-store-update", handler);
    }, []);

    const filtered = apps.filter(app => {
        const matchesLevel =
            level === AdminLevel.LEVEL_4
                ? app.currentLevel === AdminLevel.LEVEL_4 || app.status === ApplicationStatus.ACTIVE
                : app.currentLevel === level;
        const matchesSearch =
            !search ||
            app.entityName.toLowerCase().includes(search.toLowerCase()) ||
            app.id.toLowerCase().includes(search.toLowerCase());
        return matchesLevel && matchesSearch;
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search applications..."
                        className="pl-10"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" /> Filter
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead className="w-[120px]">App ID</TableHead>
                            <TableHead>Organisation Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date Received</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-slate-400 text-sm">
                                    No applications at this level.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.id}</TableCell>
                                    <TableCell>{app.entityName}</TableCell>
                                    <TableCell>{app.entityCategory}</TableCell>
                                    <TableCell>{app.submissionDate}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={statusColors[app.status]}>
                                            {app.status.replace(/_/g, " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2 text-primary hover:text-primary hover:bg-primary/5"
                                            onClick={() => setSelectedApp(app)}
                                        >
                                            <Eye className="h-4 w-4" />
                                            Review
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination hint */}
            <div className="flex items-center justify-between px-2 pt-2">
                <p className="text-xs text-muted-foreground">
                    Showing {filtered.length} application{filtered.length !== 1 ? "s" : ""}
                </p>
            </div>

            {selectedApp && (
                <ApplicationReviewDetail
                    application={selectedApp}
                    userRole={level}
                    onClose={() => setSelectedApp(null)}
                    onCommit={(updated) => {
                        setSelectedApp(null);
                        setApps(getApplications());
                    }}
                />
            )}
        </div>
    );
}
