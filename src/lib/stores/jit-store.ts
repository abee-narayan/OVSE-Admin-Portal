import { AdminLevel } from "@/types";

export interface JITSession {
    elevatedRole: AdminLevel;  // The role's access the user temporarily gets
    baseRole: AdminLevel;      // Their actual role
    expiresAt: string;         // ISO timestamp
}

// Module-level singleton — shared across components
let current: JITSession | null = null;

const EVENT = "jit-store-update";

function notify() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(EVENT));
    }
}

/** Start a JIT elevation session */
export function activateJIT(baseRole: AdminLevel, durationMinutes: number): JITSession {
    const elevated = elevatedRoleFor(baseRole);
    current = {
        baseRole,
        elevatedRole: elevated,
        expiresAt: new Date(Date.now() + durationMinutes * 60_000).toISOString(),
    };
    notify();
    return current;
}

/** Clear any active JIT session (called on expiry or manual cancel) */
export function clearJIT() {
    current = null;
    notify();
}

/** Get current session, automatically clearing if expired */
export function getJIT(): JITSession | null {
    if (!current) return null;
    if (new Date(current.expiresAt).getTime() <= Date.now()) {
        current = null;
        notify();
        return null;
    }
    return current;
}

/** Subscribe to JIT changes — returns unsubscribe fn */
export function subscribeJIT(fn: () => void): () => void {
    if (typeof window === "undefined") return () => { };
    window.addEventListener(EVENT, fn);
    return () => window.removeEventListener(EVENT, fn);
}

/**
 * JIT elevation mapping — each level gets access ONE step up:
 *  L1 → L2 access
 *  L2 → L3 access (User Management unlocked)
 *  L3 → L4 access (Governance unlocked)
 *  L4 → no JIT (they're already at the top)
 */
export function elevatedRoleFor(role: AdminLevel): AdminLevel {
    switch (role) {
        case AdminLevel.LEVEL_1: return AdminLevel.LEVEL_2;
        case AdminLevel.LEVEL_2: return AdminLevel.LEVEL_3;
        case AdminLevel.LEVEL_3: return AdminLevel.LEVEL_4;
        default: return role; // L4 stays L4 (shouldn't be called)
    }
}
