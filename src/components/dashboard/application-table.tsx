"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_APPLICATIONS } from "@/constants/mock-data";
import { Application, ApplicationStatus, AdminLevel } from "@/types";
import { Eye, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ApplicationReviewDetail } from "./application-review-detail";

const statusColors: Record<ApplicationStatus, string> = {
    [ApplicationStatus.PENDING]: "bg-orange-100 text-orange-700 border-orange-200",
    [ApplicationStatus.UNDER_SCRUTINY]: "bg-blue-100 text-blue-700 border-blue-200",
    [ApplicationStatus.UNDER_EXAMINATION]: "bg-cyan-100 text-cyan-700 border-cyan-200",
    [ApplicationStatus.UNDER_REVIEW]: "bg-purple-100 text-purple-700 border-purple-200",
    [ApplicationStatus.PENDING_FINAL_APPROVAL]: "bg-indigo-100 text-indigo-700 border-indigo-200",
    [ApplicationStatus.APPROVED]: "bg-emerald-100 text-emerald-700 border-emerald-200",
    [ApplicationStatus.REJECTED]: "bg-red-100 text-red-700 border-red-200",
    [ApplicationStatus.CORRECTION_REQUIRED]: "bg-amber-100 text-amber-700 border-amber-200",
};

export function ApplicationTable({ level }: { level: AdminLevel }) {
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search applications..." className="pl-10" />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead className="w-[120px]">App ID</TableHead>
                            <TableHead>Organization Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date Received</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_APPLICATIONS.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell className="font-medium">{app.id}</TableCell>
                                <TableCell>{app.entityName}</TableCell>
                                <TableCell>{app.entityCategory}</TableCell>
                                <TableCell>{app.submissionDate}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={statusColors[app.status]}>
                                        {app.status.replace(/_/g, ' ')}
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
                        ))}
                    </TableBody>
                </Table>
            </div>

            {selectedApp && (
                <ApplicationReviewDetail
                    application={selectedApp}
                    userRole={level}
                    onClose={() => setSelectedApp(null)}
                />
            )}

            <div className="flex items-center justify-between px-2 pt-4">
                <p className="text-xs text-muted-foreground">Showing 4 of 287 applications</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                </div>
            </div>
        </div>
    );
}
