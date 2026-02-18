"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Application, AdminLevel, ApplicationStatus } from "@/types";
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    Eye,
    MessageSquare,
    Clock,
    User
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React from "react";

interface AppReviewProps {
    application: Application;
    userRole: AdminLevel;
    onClose: () => void;
}

export function ApplicationReviewDetail({ application, userRole, onClose }: AppReviewProps) {
    const [comments, setComments] = useState("");
    const [recommendation, setRecommendation] = useState<'APPROVE' | 'REJECT' | 'CORRECTION' | null>(null);

    const canApprove = (userRole === AdminLevel.LEVEL_1 && application.currentLevel === AdminLevel.LEVEL_1) ||
        (userRole === AdminLevel.LEVEL_2 && application.currentLevel === AdminLevel.LEVEL_2) ||
        (userRole === AdminLevel.LEVEL_3 && application.currentLevel === AdminLevel.LEVEL_3) ||
        (userRole === AdminLevel.LEVEL_4 && application.currentLevel === AdminLevel.LEVEL_4);

    const getRoleTerminology = (role: AdminLevel) => {
        switch (role) {
            case AdminLevel.LEVEL_1: return "Recommendation (Stage 1)";
            case AdminLevel.LEVEL_2: return "Review (Stage 2)";
            case AdminLevel.LEVEL_3: return "Preapproval (Stage 3)";
            case AdminLevel.LEVEL_4: return "Final Approval (Stage 4)";
            default: return "Application Review";
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] p-0 flex flex-col gap-0 border-none shadow-2xl overflow-hidden rounded-xl">
                {/* Header Section */}
                <DialogHeader className="p-6 bg-white border-b shrink-0">
                    <div className="flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <DialogTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
                                    {getRoleTerminology(userRole)}: {application.entityName}
                                </DialogTitle>
                                <Badge className="bg-blue-600 text-white font-mono px-3 py-1 rounded-full border-none shadow-sm">
                                    ID: {application.id}
                                </Badge>
                                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 font-bold px-3 py-1 uppercase tracking-tighter">
                                    {application.currentLevel.replace('_', ' ')}
                                </Badge>
                            </div>
                            <DialogDescription className="text-slate-500 font-medium flex items-center gap-4">
                                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Submitted: {application.submissionDate}</span>
                                <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> Category: {application.entityCategory}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex flex-1 min-h-0 overflow-hidden">
                    {/* Left Panel: All Application Info (Scrollable) */}
                    <div className="flex-1 overflow-y-auto bg-slate-50/30 p-8 custom-scrollbar">
                        <div className="max-w-4xl mx-auto space-y-8 pb-12">

                            {/* Section 1: Entity Profile */}
                            <section className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                <div className="bg-slate-50 px-6 py-4 border-b flex items-center gap-2">
                                    <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Entity Details & Profile</h3>
                                </div>
                                <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-12">
                                    <DataField label="Registered Name" value={application.entityName} />
                                    <DataField label="Entity Category" value={application.entityCategory} />
                                    <DataField label="Registration Number" value={application.data?.entityDetails.registrationNumber || "N/A"} />
                                    <DataField label="Date of Incorporation" value={application.data?.entityDetails.dateOfIncorporation || "N/A"} />
                                    <DataField label="Registered Address" value={application.data?.entityDetails.address || "N/A"} className="col-span-2" />
                                    <DataField label="State / Pincode" value={`${application.data?.entityDetails.state || "N/A"} - ${application.data?.entityDetails.pincode || "N/A"}`} />
                                    <DataField label="Company Website" value={application.data?.entityDetails.website || "N/A"} />
                                </div>
                            </section>

                            {/* Section 2: Contact Information */}
                            <section className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                <div className="bg-slate-50 px-6 py-4 border-b flex items-center gap-2">
                                    <div className="h-8 w-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Primary Contact Person</h3>
                                </div>
                                <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-12">
                                    <DataField label="Full Name" value={application.data?.contactPerson.name || "N/A"} />
                                    <DataField label="Designation" value={application.data?.contactPerson.designation || "N/A"} />
                                    <DataField label="Mobile Number" value={application.data?.contactPerson.mobile || "N/A"} />
                                    <DataField label="Official Email" value={application.data?.contactPerson.email || "N/A"} />
                                </div>
                            </section>

                            {/* Section 3: Statutory & Tax Info */}
                            <section className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                <div className="bg-slate-50 px-6 py-4 border-b flex items-center gap-2">
                                    <div className="h-8 w-8 rounded bg-amber-100 flex items-center justify-center text-amber-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Statutory Compliance</h3>
                                </div>
                                <div className="p-6 grid grid-cols-3 gap-6">
                                    <DataField label="PAN Number" value={application.data?.statutoryInfo.panNumber || "N/A"} />
                                    <DataField label="GST Number" value={application.data?.statutoryInfo.gstNumber || "N/A"} />
                                    <DataField label="TAN Number" value={application.data?.statutoryInfo.tanNumber || "N/A"} />
                                </div>
                            </section>

                            {/* Section 4: Uploaded Documents */}
                            <section className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                <div className="bg-slate-50 px-6 py-4 border-b flex items-center gap-2">
                                    <div className="h-8 w-8 rounded bg-orange-100 flex items-center justify-center text-orange-600">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Uploaded Supporting Documents</h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        {['PAN_Card.pdf', 'GST_Registration.pdf', 'Incorporation_Certificate.pdf', 'Entity_Profile_Deck.pdf'].map((doc) => (
                                            <div key={doc} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50">
                                                        <FileText className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{doc}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Verified Digital Copy</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="rounded-full">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Section 5: Recommendations History */}
                            {application.recommendations.length > 0 && (
                                <section className="bg-slate-100/50 rounded-xl border-2 border-dashed border-slate-200 p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Clock className="h-5 w-5 text-slate-400" />
                                        <h3 className="font-bold text-slate-600">Level History & Audit Trail</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {application.recommendations.map((rec, i) => (
                                            <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border shadow-sm">
                                                <div className="h-10 w-10 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                                                    L{rec.level.charAt(6)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-sm font-bold">{rec.level.replace('_', ' ')}</p>
                                                        <Badge className={cn(
                                                            "text-[10px] font-bold px-2 py-0 border-none",
                                                            rec.action === 'APPROVE' ? 'bg-emerald-100 text-emerald-700' :
                                                                rec.action === 'REJECT' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                                        )}>
                                                            {rec.action}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed italic">"{rec.comments}"</p>
                                                    <p className="text-[10px] text-slate-400 mt-2 font-medium">Verified by Officer: {rec.recommenderId} • {new Date(rec.timestamp).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Task-Specific Controls (Fixed) */}
                    <div className="w-[450px] bg-white border-l flex flex-col shrink-0 overflow-y-auto">
                        <div className="p-8 space-y-8 pb-12">
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
                                    <div className="h-10 w-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                    Level {userRole.charAt(6)} Tasks
                                </h3>
                                <p className="text-sm text-slate-500 leading-snug">
                                    {userRole === AdminLevel.LEVEL_1 && "Scrutiny of documents and initial eligibility check."}
                                    {userRole === AdminLevel.LEVEL_2 && "Detailed examination of regulatory compliance and policy match."}
                                    {userRole === AdminLevel.LEVEL_3 && "Risk profiling and pre-approval verification for Director sign-off."}
                                    {userRole === AdminLevel.LEVEL_4 && "Final authorization for OVSE registration certificate issuance."}
                                </p>
                            </div>

                            {/* Differentiated Controls: Level Checklists */}
                            <div className="bg-slate-50 p-6 rounded-xl border space-y-4">
                                <p className="text-[11px] font-black uppercase tracking-widest text-blue-900 mb-2">{getRoleTerminology(userRole).split(' ')[0]} Checklist</p>
                                <div className="space-y-3">
                                    {getLevelChecklist(userRole).map((item, i) => (
                                        <label key={i} className="flex items-start gap-3 cursor-pointer group">
                                            <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900" />
                                            <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Processing Remarks</label>
                                <Textarea
                                    placeholder={`Enter your ${getRoleTerminology(userRole).split(' ')[0].toLowerCase()} remarks here...`}
                                    className="min-h-[150px] bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl p-6 text-sm leading-relaxed"
                                    value={comments}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                                />
                                <div className="p-4 bg-blue-50 rounded-lg text-[10px] text-blue-700 italic border border-blue-100">
                                    Note: Your remarks will be visible to all subsequent review levels and the applicant (if corrections are requested).
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Recommendation Decision</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {getRecommendationOptions(userRole).map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setRecommendation(opt.id as any)}
                                            className={cn(
                                                "w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-300 text-left",
                                                recommendation === opt.id
                                                    ? opt.activeBorder
                                                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-10 w-10 shrink-0 rounded-lg flex items-center justify-center border-2 transition-all",
                                                recommendation === opt.id ? opt.activeIcon : "bg-white text-slate-300 border-slate-100"
                                            )}>
                                                <opt.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className={cn(
                                                    "text-sm font-black transition-colors uppercase tracking-tighter",
                                                    recommendation === opt.id ? opt.activeText : "text-slate-600"
                                                )}>{opt.label}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{opt.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 border-t">
                                <Button
                                    className={cn(
                                        "w-full h-14 font-black uppercase tracking-widest text-sm rounded-xl shadow-lg shadow-blue-900/10 transition-all hover:-translate-y-0.5 active:translate-y-0",
                                        recommendation ? "bg-blue-900 hover:bg-blue-950 text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    )}
                                    disabled={!recommendation}
                                >
                                    Proceed & Commit {getRoleTerminology(userRole).split(' ')[0]}
                                </Button>
                                <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-tighter">Secure Audit Log PIN: {Math.floor(1000 + Math.random() * 9000)}-{userRole.charAt(6)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Helper for Level-specific Checklists
function getLevelChecklist(role: AdminLevel) {
    switch (role) {
        case AdminLevel.LEVEL_1:
            return [
                "PAN details matched with incorporation docs",
                "GST registration status verified as ACTIVE",
                "Business address proof is valid & current",
                "Entity category matches incorporation sub-type"
            ];
        case AdminLevel.LEVEL_2:
            return [
                "Compliance with OVSE Regulatory Policy v2.1",
                "No prohibited business activities detected",
                "Entity directors verified against UIDAI watchlist",
                "Financial stability audit documents approved"
            ];
        case AdminLevel.LEVEL_3:
            return [
                "Full high-level risk profile completed",
                "Level 1 & 2 recommendations justified with evidence",
                "Verification of all critical KYC documents",
                "Ready for final Director General sign-off"
            ];
        case AdminLevel.LEVEL_4:
            return [
                "Final policy alignment check confirmed",
                "Review trail verified for protocol adherence",
                "Digital certificate generation authorized",
                "Secure log entry for final executive decision"
            ];
        default:
            return ["Information review complete"];
    }
}

// Helper components for clean code
function DataField({ label, value, className = "" }: { label: string; value: string; className?: string }) {
    return (
        <div className={cn("space-y-1", className)}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
            <p className="text-sm font-bold text-slate-800 leading-tight">{value}</p>
        </div>
    );
}

// Helper for dynamic options
function getRecommendationOptions(role: AdminLevel) {
    const nextLevelNum = role === AdminLevel.LEVEL_1 ? 2 : role === AdminLevel.LEVEL_2 ? 3 : 4;
    const nextLevelName = role === AdminLevel.LEVEL_1 ? "Examination" : role === AdminLevel.LEVEL_2 ? "Review" : "Approval";

    if (role === AdminLevel.LEVEL_4) {
        return [
            {
                id: 'APPROVE',
                label: 'Commit Final Approval',
                desc: 'Issue registration certificate to the entity.',
                icon: CheckCircle2,
                activeBorder: "border-emerald-500 bg-emerald-50/50",
                activeIcon: "bg-emerald-500 text-white border-emerald-500",
                activeText: "text-emerald-900"
            },
            {
                id: 'REJECT',
                label: 'Final Rejection of Application',
                desc: 'Deny registration and close the case.',
                icon: XCircle,
                activeBorder: "border-rose-500 bg-rose-50/50",
                activeIcon: "bg-rose-500 text-white border-rose-500",
                activeText: "text-rose-900"
            },
            {
                id: 'CORRECTION',
                label: 'Refer Back for Critical Correction',
                desc: 'Request additional data from the applicant.',
                icon: AlertCircle,
                activeBorder: "border-amber-500 bg-amber-50/50",
                activeIcon: "bg-amber-500 text-white border-amber-500",
                activeText: "text-amber-900"
            }
        ];
    }

    return [
        {
            id: 'APPROVE',
            label: `Positive Recommendation for Level ${nextLevelNum}`,
            desc: `Forward to ${nextLevelName} stage with approval suggestion.`,
            icon: CheckCircle2,
            activeBorder: "border-emerald-500 bg-emerald-50/50",
            activeIcon: "bg-emerald-500 text-white border-emerald-500",
            activeText: "text-emerald-900"
        },
        {
            id: 'REJECT',
            label: `Negative Recommendation for Level ${nextLevelNum}`,
            desc: `Forward to ${nextLevelName} stage with rejection suggestion.`,
            icon: XCircle,
            activeBorder: "border-rose-500 bg-rose-50/50",
            activeIcon: "bg-rose-500 text-white border-rose-500",
            activeText: "text-rose-900"
        },
        {
            id: 'CORRECTION',
            label: 'Request Clarification / Correction',
            desc: 'Applicants will be notified to update their submission.',
            icon: AlertCircle,
            activeBorder: "border-amber-500 bg-amber-50/50",
            activeIcon: "bg-amber-500 text-white border-amber-500",
            activeText: "text-amber-900"
        }
    ];
}
