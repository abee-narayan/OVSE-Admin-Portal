"use client";

import { useState, useEffect } from "react";
import { AdminLevel } from "@/types";
import { AdminUser, AdminUserStatus } from "@/types";

interface MfaBadgeProps {
    mfaEnabled: boolean;
    mfaType: 'FIDO2' | 'TOTP' | 'None';
}

export function MfaBadge({ mfaEnabled, mfaType }: MfaBadgeProps) {
    if (!mfaEnabled || mfaType === 'None') {
        return (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                MFA Required
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            {mfaType} ✓
        </span>
    );
}
