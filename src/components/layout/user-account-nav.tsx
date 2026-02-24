"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminLevel } from "@/types";
import { MOCK_USERS, getCurrentUser, setCurrentRole } from "@/lib/auth/mock-auth";
import { getRoleFromPathname } from "./main-nav";
import { ChevronDown } from "lucide-react";

const ROLE_META: Record<AdminLevel, { label: string; roleLabel: string; color: string; num: string }> = {
    [AdminLevel.LEVEL_1]: { label: "John Scrutiny", roleLabel: "L1 – Support Desk", color: "bg-slate-500", num: "1" },
    [AdminLevel.LEVEL_2]: { label: "Alice Examiner", roleLabel: "L2 – Senior Support", color: "bg-cyan-600", num: "2" },
    [AdminLevel.LEVEL_3]: { label: "Bob Reviewer", roleLabel: "L3 – Operations Lead", color: "bg-blue-700", num: "3" },
    [AdminLevel.LEVEL_4]: { label: "Director General", roleLabel: "L4 – Super Admin", color: "bg-orange-600", num: "4" },
};

export function UserAccountNav() {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => { setMounted(true); }, []);

    if (!mounted) {
        return <div className="animate-pulse h-10 w-32 bg-slate-100 rounded-lg" />;
    }

    // Derive current role from URL (preferred) or localStorage
    const roleFromUrl = getRoleFromPathname(pathname);
    const activeUser = roleFromUrl ? MOCK_USERS[roleFromUrl] : getCurrentUser();
    const meta = ROLE_META[activeUser.role];

    const handleSwitch = (role: AdminLevel) => {
        setCurrentRole(role);
        setOpen(false);
        const num = ROLE_META[role].num;
        router.push(`/level_${num}/dashboard`);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
            >
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold leading-tight">{activeUser.name}</p>
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide">{meta.roleLabel}</p>
                </div>
                <div className={`h-9 w-9 rounded-full ${meta.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {activeUser.name.charAt(0)}
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border bg-white shadow-xl py-2 overflow-hidden">
                        <p className="text-[11px] text-slate-400 uppercase font-semibold px-4 py-2 border-b">Switch Role (Demo)</p>
                        {(Object.values(AdminLevel) as AdminLevel[]).map(role => {
                            const m = ROLE_META[role];
                            const isActive = activeUser.role === role;
                            return (
                                <button
                                    key={role}
                                    onClick={() => handleSwitch(role)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${isActive ? 'bg-blue-50' : ''}`}
                                >
                                    <div className={`h-8 w-8 rounded-full ${m.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                                        {m.label.charAt(0)}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>{m.label}</p>
                                        <p className="text-[11px] text-slate-400">{m.roleLabel}</p>
                                    </div>
                                    {isActive && <span className="ml-auto text-blue-600 text-xs font-semibold">Active</span>}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
