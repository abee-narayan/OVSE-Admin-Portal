"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminLevel } from "@/types";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileCheck, Users, ShieldCheck, Zap } from "lucide-react";
import { getJIT, subscribeJIT } from "@/lib/stores/jit-store";

// Derive role purely from the URL — no server-side localStorage needed
export function getRoleFromPathname(pathname: string): AdminLevel | null {
    if (pathname.startsWith("/level_4")) return AdminLevel.LEVEL_4;
    if (pathname.startsWith("/level_3")) return AdminLevel.LEVEL_3;
    if (pathname.startsWith("/level_2")) return AdminLevel.LEVEL_2;
    if (pathname.startsWith("/level_1")) return AdminLevel.LEVEL_1;
    return null;
}

interface NavItem {
    title: string;
    href: string;
    icon: any;
    jitOnly?: boolean; // Only shown during an active JIT session
}

function getNavItems(role: AdminLevel): NavItem[] {
    const num = role === AdminLevel.LEVEL_1 ? "1"
        : role === AdminLevel.LEVEL_2 ? "2"
            : role === AdminLevel.LEVEL_3 ? "3"
                : "4";

    const items: NavItem[] = [
        { title: "Dashboard", href: `/level_${num}/dashboard`, icon: LayoutDashboard },
        { title: "OVSE Management", href: `/level_${num}/ovse_management`, icon: FileCheck },
    ];

    if (role === AdminLevel.LEVEL_3 || role === AdminLevel.LEVEL_4) {
        items.push({ title: "User Management", href: `/level_${num}/admin/users`, icon: Users });
    }
    if (role === AdminLevel.LEVEL_4) {
        items.push({ title: "Governance", href: `/level_4/admin/governance`, icon: ShieldCheck });
    }

    return items;
}

/** Extra nav items unlocked during JIT elevation */
function getJitNavItems(elevatedRole: AdminLevel): NavItem[] {
    const num = elevatedRole === AdminLevel.LEVEL_2 ? "2"
        : elevatedRole === AdminLevel.LEVEL_3 ? "3"
            : "4";

    const items: NavItem[] = [
        { title: "OVSE Mgmt (JIT)", href: `/level_${num}/ovse_management`, icon: FileCheck, jitOnly: true },
    ];

    if (elevatedRole === AdminLevel.LEVEL_3 || elevatedRole === AdminLevel.LEVEL_4) {
        items.push({ title: "User Mgmt (JIT)", href: `/level_${num}/admin/users`, icon: Users, jitOnly: true });
    }
    if (elevatedRole === AdminLevel.LEVEL_4) {
        items.push({ title: "Governance (JIT)", href: `/level_4/admin/governance`, icon: ShieldCheck, jitOnly: true });
    }

    return items;
}

export function MainNav({ userRole }: { userRole?: AdminLevel }) {
    const pathname = usePathname();
    const [jitSession, setJitSession] = useState(() => getJIT());

    // Subscribe to JIT store changes
    useEffect(() => {
        const sync = () => setJitSession(getJIT());
        const unsub = subscribeJIT(sync);
        return unsub;
    }, []);

    const roleFromUrl = getRoleFromPathname(pathname);
    const activeRole = roleFromUrl ?? userRole;

    if (!activeRole) return null;

    const navItems = getNavItems(activeRole);
    const jitItems = jitSession ? getJitNavItems(jitSession.elevatedRole) : [];

    return (
        <nav className="flex items-center space-x-1 text-sm font-medium">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href ||
                    (item.href.length > 1 && pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "transition-all hover:text-primary relative flex items-center gap-1.5 px-3 py-2 rounded-md",
                            isActive
                                ? "text-blue-700 bg-blue-50 font-semibold"
                                : "text-muted-foreground hover:bg-slate-50"
                        )}
                    >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {item.title}
                    </Link>
                );
            })}

            {/* JIT-elevated nav items */}
            {jitItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href ||
                    (item.href.length > 1 && pathname.startsWith(item.href));
                return (
                    <Link
                        key={`jit-${item.href}`}
                        href={item.href}
                        className={cn(
                            "transition-all relative flex items-center gap-1.5 px-3 py-2 rounded-md border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100",
                            isActive && "bg-purple-100 font-semibold"
                        )}
                        title="Accessible via JIT Elevation"
                    >
                        <Zap className="h-3 w-3 shrink-0" />
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {item.title}
                    </Link>
                );
            })}
        </nav>
    );
}
