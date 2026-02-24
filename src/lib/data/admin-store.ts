import {
    AdminUser,
    AdminLevel,
    AdminUserStatus,
    PendingUserChange,
    PendingChangeType,
    AuditLogEntry,
    AuditSeverity,
    JITElevationRequest,
    JITDuration,
    AdminSession,
} from '@/types';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_ADMIN_USERS: AdminUser[] = [
    {
        id: 'l1-001', name: 'Rahul Sharma', email: 'rahul.sharma@uidai.gov.in',
        role: AdminLevel.LEVEL_1, department: 'Help Desk – North Zone',
        status: 'active', mfaEnabled: false, mfaType: 'None',
        lastActive: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
        id: 'l1-002', name: 'Priya Nair', email: 'priya.nair@uidai.gov.in',
        role: AdminLevel.LEVEL_1, department: 'Help Desk – South Zone',
        status: 'active', mfaEnabled: false, mfaType: 'None',
        lastActive: new Date(Date.now() - 22 * 60000).toISOString(),
    },
    {
        id: 'l1-003', name: 'Amit Verma', email: 'amit.verma@uidai.gov.in',
        role: AdminLevel.LEVEL_1, department: 'Help Desk – East Zone',
        status: 'disabled', mfaEnabled: false, mfaType: 'None',
        lastActive: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    },
    {
        id: 'l2-001', name: 'Alice Examiner', email: 'alice.examiner@uidai.gov.in',
        role: AdminLevel.LEVEL_2, department: 'Senior Support – Central',
        status: 'active', mfaEnabled: true, mfaType: 'TOTP',
        lastActive: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
        id: 'l2-002', name: 'Vikram Singh', email: 'vikram.singh@uidai.gov.in',
        role: AdminLevel.LEVEL_2, department: 'Senior Support – West Zone',
        status: 'active', mfaEnabled: true, mfaType: 'FIDO2',
        lastActive: new Date(Date.now() - 45 * 60000).toISOString(),
    },
    {
        id: 'l3-001', name: 'Bob Reviewer', email: 'bob.reviewer@uidai.gov.in',
        role: AdminLevel.LEVEL_3, department: 'Operations',
        status: 'active', mfaEnabled: true, mfaType: 'FIDO2',
        lastActive: new Date(Date.now() - 2 * 60000).toISOString(),
    },
];

const SEED_PENDING_CHANGES: PendingUserChange[] = [
    {
        id: 'pc-001',
        type: 'ADD_USER',
        requestedById: 'l3-001',
        requestedByName: 'Bob Reviewer',
        targetName: 'Sunita Gupta',
        targetEmail: 'sunita.gupta@uidai.gov.in',
        targetRole: AdminLevel.LEVEL_1,
        department: 'Help Desk – West Zone',
        submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        status: 'pending',
    },
    {
        id: 'pc-002',
        type: 'DELETE_USER',
        requestedById: 'l3-001',
        requestedByName: 'Bob Reviewer',
        targetName: 'Amit Verma',
        targetEmail: 'amit.verma@uidai.gov.in',
        targetRole: AdminLevel.LEVEL_1,
        department: 'Help Desk – East Zone',
        submittedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
        status: 'pending',
    },
];

const SEED_AUDIT_LOGS: AuditLogEntry[] = [
    {
        id: 'al-001', timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        actorId: 'l4-001', actorName: 'Director General', actorLevel: AdminLevel.LEVEL_4,
        action: 'APPROVED_USER_ADD', targetId: 'NEW', targetName: 'Previous Staff Member',
        details: 'L3 add-user request approved and account provisioned.', severity: 'info',
    },
    {
        id: 'al-002', timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        actorId: 'l3-001', actorName: 'Bob Reviewer', actorLevel: AdminLevel.LEVEL_3,
        action: 'SUBMITTED_ADD_USER', targetId: 'sunita.gupta', targetName: 'Sunita Gupta',
        details: 'Add L1 user request submitted for L4 approval.', severity: 'info',
    },
    {
        id: 'al-003', timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        actorId: 'l4-001', actorName: 'Director General', actorLevel: AdminLevel.LEVEL_4,
        action: 'DISABLED_ADMIN', targetId: 'l1-003', targetName: 'Amit Verma',
        details: 'Admin account disabled due to inactivity policy.', severity: 'warning',
    },
    {
        id: 'al-004', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        actorId: 'l4-001', actorName: 'Director General', actorLevel: AdminLevel.LEVEL_4,
        action: 'REJECTED_USER_DELETE', targetId: 'l2-001', targetName: 'Alice Examiner',
        details: 'L3 delete request rejected: insufficient justification.', severity: 'warning',
    },
    {
        id: 'al-005', timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
        actorId: 'l2-001', actorName: 'Alice Examiner', actorLevel: AdminLevel.LEVEL_2,
        action: 'JIT_ELEVATION_REQUESTED', targetId: undefined, targetName: undefined,
        details: 'JIT elevation requested for 2-hour window: Configuration audit.', severity: 'info',
    },
    {
        id: 'al-006', timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
        actorId: 'l4-001', actorName: 'Director General', actorLevel: AdminLevel.LEVEL_4,
        action: 'EMERGENCY_FREEZE', targetId: undefined, targetName: 'L1 Tier',
        details: 'Emergency freeze applied to all L1 accounts. Lifted 90 minutes later.', severity: 'critical',
    },
    {
        id: 'al-007', timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
        actorId: 'l3-001', actorName: 'Bob Reviewer', actorLevel: AdminLevel.LEVEL_3,
        action: 'SUBMITTED_DELETE_USER', targetId: 'l1-003', targetName: 'Amit Verma',
        details: 'Delete L1 user request submitted for L4 approval.', severity: 'info',
    },
    {
        id: 'al-008', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
        actorId: 'l2-002', actorName: 'Vikram Singh', actorLevel: AdminLevel.LEVEL_2,
        action: 'LOGIN', targetId: undefined, targetName: undefined,
        details: 'Successful login with FIDO2 MFA.', severity: 'info',
    },
    {
        id: 'al-009', timestamp: new Date(Date.now() - 26 * 3600000).toISOString(),
        actorId: 'l1-001', actorName: 'Rahul Sharma', actorLevel: AdminLevel.LEVEL_1,
        action: 'TICKET_RESOLVED', targetId: undefined, targetName: 'TKT-4421',
        details: 'Support ticket resolved: Aadhaar fetch timeout for entity AUA-09.', severity: 'info',
    },
    {
        id: 'al-010', timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
        actorId: 'l4-001', actorName: 'Director General', actorLevel: AdminLevel.LEVEL_4,
        action: 'POLICY_UPDATE', targetId: undefined, targetName: 'Session Timeout Policy',
        details: 'Session timeout policy updated from 60 min to 30 min for L1/L2 accounts.', severity: 'warning',
    },
];

const SEED_SESSIONS: AdminSession[] = [
    {
        id: 'sess-001', adminId: 'l1-001', adminName: 'Rahul Sharma',
        adminRole: AdminLevel.LEVEL_1, startTime: new Date(Date.now() - 65 * 60000).toISOString(),
        durationMinutes: 65, actionCount: 12,
        actionsLog: [
            { timestamp: new Date(Date.now() - 65 * 60000).toISOString(), description: 'Logged in successfully (TOTP MFA)' },
            { timestamp: new Date(Date.now() - 60 * 60000).toISOString(), description: 'Opened ticket TKT-4421' },
            { timestamp: new Date(Date.now() - 55 * 60000).toISOString(), description: 'Viewed applicant entity AUA-09 profile' },
            { timestamp: new Date(Date.now() - 50 * 60000).toISOString(), description: 'Added comment to TKT-4421: "Escalating to L2"' },
            { timestamp: new Date(Date.now() - 48 * 60000).toISOString(), description: 'Escalated ticket to L2 support' },
            { timestamp: new Date(Date.now() - 40 * 60000).toISOString(), description: 'Opened ticket TKT-4422' },
            { timestamp: new Date(Date.now() - 35 * 60000).toISOString(), description: 'Resolved ticket TKT-4422: Config documentation shared' },
            { timestamp: new Date(Date.now() - 20 * 60000).toISOString(), description: 'Ran Aadhaar connectivity diagnostic on AUA-11' },
            { timestamp: new Date(Date.now() - 10 * 60000).toISOString(), description: 'Logged diagnostic result: pass' },
            { timestamp: new Date(Date.now() - 5 * 60000).toISOString(), description: 'Session still active' },
        ],
    },
    {
        id: 'sess-002', adminId: 'l2-001', adminName: 'Alice Examiner',
        adminRole: AdminLevel.LEVEL_2, startTime: new Date(Date.now() - 120 * 60000).toISOString(),
        durationMinutes: 120, actionCount: 8,
        actionsLog: [
            { timestamp: new Date(Date.now() - 120 * 60000).toISOString(), description: 'Logged in with TOTP MFA' },
            { timestamp: new Date(Date.now() - 115 * 60000).toISOString(), description: 'Reviewed escalated ticket TKT-4421' },
            { timestamp: new Date(Date.now() - 110 * 60000).toISOString(), description: 'Ran advanced config check on AUA-09' },
            { timestamp: new Date(Date.now() - 100 * 60000).toISOString(), description: 'Identified misconfigured API timeout setting' },
            { timestamp: new Date(Date.now() - 90 * 60000).toISOString(), description: 'Corrected timeout configuration for AUA-09' },
            { timestamp: new Date(Date.now() - 80 * 60000).toISOString(), description: 'JIT elevation requested: 2-hour window' },
            { timestamp: new Date(Date.now() - 70 * 60000).toISOString(), description: 'Accessed system configuration panel (JIT elevated)' },
            { timestamp: new Date(Date.now() - 60 * 60000).toISOString(), description: 'Session ended – user logged out' },
        ],
    },
    {
        id: 'sess-003', adminId: 'l1-002', adminName: 'Priya Nair',
        adminRole: AdminLevel.LEVEL_1, startTime: new Date(Date.now() - 30 * 60000).toISOString(),
        durationMinutes: 30, actionCount: 5,
        actionsLog: [
            { timestamp: new Date(Date.now() - 30 * 60000).toISOString(), description: 'Logged in' },
            { timestamp: new Date(Date.now() - 28 * 60000).toISOString(), description: 'Opened ticket TKT-4430' },
            { timestamp: new Date(Date.now() - 22 * 60000).toISOString(), description: 'Added resolution note to TKT-4430' },
            { timestamp: new Date(Date.now() - 18 * 60000).toISOString(), description: 'Resolved TKT-4430: Password reset guidance provided' },
            { timestamp: new Date(Date.now() - 10 * 60000).toISOString(), description: 'Browsing ticket queue' },
        ],
    },
    {
        id: 'sess-004', adminId: 'l2-002', adminName: 'Vikram Singh',
        adminRole: AdminLevel.LEVEL_2, startTime: new Date(Date.now() - 45 * 60000).toISOString(),
        durationMinutes: 45, actionCount: 7,
        actionsLog: [
            { timestamp: new Date(Date.now() - 45 * 60000).toISOString(), description: 'Logged in with FIDO2 hardware key' },
            { timestamp: new Date(Date.now() - 40 * 60000).toISOString(), description: 'Reviewed complex config case: AUA-55' },
            { timestamp: new Date(Date.now() - 35 * 60000).toISOString(), description: 'Ran certificate validation diagnostics' },
            { timestamp: new Date(Date.now() - 28 * 60000).toISOString(), description: 'Raised internal flag on AUA-55 for L3 review' },
            { timestamp: new Date(Date.now() - 20 * 60000).toISOString(), description: 'Documented findings in case note' },
            { timestamp: new Date(Date.now() - 10 * 60000).toISOString(), description: 'Reviewed two additional L2 tickets' },
            { timestamp: new Date(Date.now() - 5 * 60000).toISOString(), description: 'Session still active' },
        ],
    },
];

// ─── Store State ─────────────────────────────────────────────────────────────

let adminUsers: AdminUser[] = [...SEED_ADMIN_USERS];
let pendingChanges: PendingUserChange[] = [...SEED_PENDING_CHANGES];
let auditLogs: AuditLogEntry[] = [...SEED_AUDIT_LOGS];
const sessions: AdminSession[] = [...SEED_SESSIONS];

function notify() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('admin-store-update'));
    }
}

function addAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    auditLogs = [
        {
            ...entry,
            id: `al-${Date.now()}`,
            timestamp: new Date().toISOString(),
        },
        ...auditLogs,
    ];
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAdminUsers(): AdminUser[] {
    return adminUsers;
}

export function getPendingChanges(): PendingUserChange[] {
    return pendingChanges;
}

export function getAuditLogs(): AuditLogEntry[] {
    return auditLogs;
}

export function getSessions(): AdminSession[] {
    return sessions;
}

export function setAdminStatus(adminId: string, status: AdminUserStatus, actorName = 'Director General') {
    adminUsers = adminUsers.map(u =>
        u.id === adminId ? { ...u, status } : u
    );
    const target = adminUsers.find(u => u.id === adminId);
    addAudit({
        actorId: 'l4-001', actorName, actorLevel: AdminLevel.LEVEL_4,
        action: status === 'disabled' ? 'DISABLED_ADMIN' : 'ENABLED_ADMIN',
        targetId: adminId, targetName: target?.name,
        details: `Admin account ${status === 'disabled' ? 'disabled' : 'enabled'} by L4.`,
        severity: status === 'disabled' ? 'warning' : 'info',
    });
    notify();
}

export function freezeTier(tier: AdminLevel, actorName = 'Director General') {
    adminUsers = adminUsers.map(u =>
        u.role === tier ? { ...u, status: 'frozen' as AdminUserStatus } : u
    );
    addAudit({
        actorId: 'l4-001', actorName, actorLevel: AdminLevel.LEVEL_4,
        action: 'EMERGENCY_FREEZE',
        targetName: `${tier} Tier`,
        details: `Emergency freeze applied to all ${tier} accounts.`,
        severity: 'critical',
    });
    notify();
}

export function unfreezeTier(tier: AdminLevel, actorName = 'Director General') {
    adminUsers = adminUsers.map(u =>
        u.role === tier && u.status === 'frozen' ? { ...u, status: 'active' as AdminUserStatus } : u
    );
    addAudit({
        actorId: 'l4-001', actorName, actorLevel: AdminLevel.LEVEL_4,
        action: 'LIFT_FREEZE',
        targetName: `${tier} Tier`,
        details: `Emergency freeze lifted for all ${tier} accounts.`,
        severity: 'info',
    });
    notify();
}

export function submitPendingChange(
    change: Omit<PendingUserChange, 'id' | 'submittedAt' | 'status'>
): PendingUserChange {
    const newChange: PendingUserChange = {
        ...change,
        id: `pc-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'pending',
    };
    pendingChanges = [newChange, ...pendingChanges];
    addAudit({
        actorId: change.requestedById, actorName: change.requestedByName,
        actorLevel: AdminLevel.LEVEL_3,
        action: change.type === 'ADD_USER' ? 'SUBMITTED_ADD_USER' : 'SUBMITTED_DELETE_USER',
        targetName: change.targetName,
        details: `${change.type === 'ADD_USER' ? 'Add' : 'Delete'} user request submitted for L4 approval: ${change.targetName} (${change.targetRole}).`,
        severity: 'info',
    });
    notify();
    return newChange;
}

export function approveChange(changeId: string, actorName = 'Director General') {
    const change = pendingChanges.find(c => c.id === changeId);
    if (!change) return;
    pendingChanges = pendingChanges.map(c =>
        c.id === changeId ? { ...c, status: 'approved' as const, resolvedAt: new Date().toISOString() } : c
    );
    // If adding, provision the user
    if (change.type === 'ADD_USER') {
        const newUser: AdminUser = {
            id: `user-${Date.now()}`,
            name: change.targetName,
            email: change.targetEmail,
            role: change.targetRole,
            department: change.department,
            status: 'active',
            mfaEnabled: false,
            mfaType: 'None',
            lastActive: new Date().toISOString(),
        };
        adminUsers = [...adminUsers, newUser];
    } else if (change.type === 'DELETE_USER') {
        adminUsers = adminUsers.filter(u => u.email !== change.targetEmail);
    }
    addAudit({
        actorId: 'l4-001', actorName, actorLevel: AdminLevel.LEVEL_4,
        action: change.type === 'ADD_USER' ? 'APPROVED_USER_ADD' : 'APPROVED_USER_DELETE',
        targetName: change.targetName,
        details: `L3 request approved. ${change.type === 'ADD_USER' ? 'User account provisioned.' : 'User account removed.'}`,
        severity: 'info',
    });
    notify();
}

export function rejectChange(changeId: string, reason: string, actorName = 'Director General') {
    pendingChanges = pendingChanges.map(c =>
        c.id === changeId
            ? { ...c, status: 'rejected' as const, rejectionReason: reason, resolvedAt: new Date().toISOString() }
            : c
    );
    const change = pendingChanges.find(c => c.id === changeId);
    addAudit({
        actorId: 'l4-001', actorName, actorLevel: AdminLevel.LEVEL_4,
        action: 'REJECTED_USER_CHANGE',
        targetName: change?.targetName,
        details: `L3 request rejected. Reason: ${reason}`,
        severity: 'warning',
    });
    notify();
}

export function requestJIT(
    requesterId: string,
    requesterName: string,
    requesterRole: AdminLevel,
    reason: string,
    durationMinutes: JITDuration
): JITElevationRequest {
    const req: JITElevationRequest = {
        id: `jit-${Date.now()}`,
        requesterId, requesterName, requesterRole, reason, durationMinutes,
        requestedAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + durationMinutes * 60000).toISOString(),
        status: 'active',
    };
    adminUsers = adminUsers.map(u =>
        u.id === requesterId
            ? { ...u, jitActive: true, jitExpiry: req.expiresAt }
            : u
    );
    addAudit({
        actorId: requesterId, actorName: requesterName, actorLevel: requesterRole,
        action: 'JIT_ELEVATION_REQUESTED',
        details: `JIT elevation approved for ${durationMinutes} minutes. Reason: ${reason}`,
        severity: 'info',
    });
    notify();
    return req;
}

/** L4 direct authority: provision a user immediately (no approval step) */
export function addAdminUser(
    user: Pick<AdminUser, 'name' | 'email' | 'role' | 'department'>,
    actorName = 'Director General'
) {
    const newUser: AdminUser = {
        id: `user-${Date.now()}`,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: 'active',
        mfaEnabled: false,
        mfaType: 'None',
        lastActive: new Date().toISOString(),
    };
    adminUsers = [...adminUsers, newUser];
    addAudit({
        actorId: 'l4-001', actorName, actorLevel: AdminLevel.LEVEL_4,
        action: 'DIRECT_USER_ADD',
        targetName: user.name,
        details: `L4 directly provisioned user: ${user.name} (${user.role}) in ${user.department}. No approval required.`,
        severity: 'info',
    });
    notify();
    return newUser;
}

