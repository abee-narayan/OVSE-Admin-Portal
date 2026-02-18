"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminLevel } from "@/types";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileCheck,
    Clock,
    PieChart,
    Settings,
    ShieldCheck
} from "lucide-react";

interface NavItem {
    title: string;
    href: string;
    icon: any;
    roles: AdminLevel[];
}

const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        roles: [AdminLevel.LEVEL_1, AdminLevel.LEVEL_2, AdminLevel.LEVEL_3, AdminLevel.LEVEL_4],
    },
    {
        title: "Application Review",
        href: "/applications",
        icon: FileCheck,
        roles: [AdminLevel.LEVEL_1, AdminLevel.LEVEL_2, AdminLevel.LEVEL_3, AdminLevel.LEVEL_4],
    },
    {
        title: "Efficiency Hub",
        href: "/efficiency",
        icon: PieChart,
        roles: [AdminLevel.LEVEL_1, AdminLevel.LEVEL_2, AdminLevel.LEVEL_3],
    },
    {
        title: "Renewals",
        href: "/renewals",
        icon: Clock,
        roles: [AdminLevel.LEVEL_1, AdminLevel.LEVEL_2, AdminLevel.LEVEL_3],
    },
    {
        title: "System Admin",
        href: "/admin",
        icon: ShieldCheck,
        roles: [AdminLevel.LEVEL_4],
    },
];

export function MainNav({ userRole }: { userRole: AdminLevel }) {
    const pathname = usePathname();

    // Demo override: if we are on a specific dashboard route, use that role for nav filtering
    let activeRole = userRole;
    if (pathname.includes('/dashboard/level_1')) activeRole = AdminLevel.LEVEL_1;
    else if (pathname.includes('/dashboard/level_2')) activeRole = AdminLevel.LEVEL_2;
    else if (pathname.includes('/dashboard/level_3')) activeRole = AdminLevel.LEVEL_3;
    else if (pathname.includes('/dashboard/level_4')) activeRole = AdminLevel.LEVEL_4;

    return (
        <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems
                .filter((item) => item.roles.includes(activeRole))
                .map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "transition-colors hover:text-primary relative py-2",
                            pathname === item.href
                                ? "text-primary border-b-2 border-primary"
                                : "text-muted-foreground"
                        )}
                    >
                        {item.title}
                    </Link>
                ))}
        </nav>
    );
}
