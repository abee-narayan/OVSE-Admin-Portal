"use client";

import { usePathname } from "next/navigation";
import { AdminLevel, User } from "@/types";
import { MOCK_USERS, getCurrentUser } from "@/lib/auth/mock-auth";

export function UserAccountNav() {
    const activeUser = getCurrentUser();

    return (
        <div className="flex items-center gap-4">
            <div className="text-right mr-4">
                <p className="text-sm font-medium">{activeUser.name}</p>
                <p className="text-xs text-muted-foreground uppercase">{activeUser.role.replace('_', ' ')}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {activeUser.name.charAt(0)}
            </div>
        </div>
    );
}
