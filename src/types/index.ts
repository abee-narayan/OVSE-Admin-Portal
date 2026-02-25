export enum AdminLevel {
    LEVEL_1 = 'LEVEL_1', // Support Desk
    LEVEL_2 = 'LEVEL_2', // Senior Support
    LEVEL_3 = 'LEVEL_3', // Operations Lead
    LEVEL_4 = 'LEVEL_4', // Super Admin
}

export enum ApplicationStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    L1_REJECTED = 'L1_REJECTED',
    L1_APPROVED = 'L1_APPROVED',
    L2_REJECTED = 'L2_REJECTED',
    LOW_QUALITY = 'LOW_QUALITY',
    L2_APPROVED = 'L2_APPROVED',
    ACTIVE = 'ACTIVE',
    REVOKED = 'REVOKED',
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: AdminLevel;
}

export interface Application {
    id: string;
    entityName: string;
    entityCategory: string;
    submissionDate: string;
    status: ApplicationStatus;
    currentLevel: AdminLevel;
    recommendations: {
        level: AdminLevel;
        recommenderId: string;
        action: 'APPROVE' | 'REJECT' | 'CORRECTION';
        comments: string;
        timestamp: string;
    }[];
    // Draft / Nudge tracking
    draftStartedAt?: string;       // ISO — when the entity started the draft
    nudgedByL1Id?: string;         // L1 agent who nudged this draft
    nudgedByL1Name?: string;
    nudgeTimestamp?: string;        // ISO
    lowQualityFlag?: boolean;      // set by L2 on rejection → penalises nudging L1
    lowQualityReason?: string;
    // Existing optional fields
    is_ftr?: boolean;
    l1_comments?: string;
    l1_approved_by?: string;
    l2_approved_by?: string;
    l3_approved_by?: string;
    client_id?: string;
    x509_certificate?: string;
    revoked_at?: string;
    revocationReason?: string;
    data?: {
        entityDetails: {
            address: string;
            state: string;
            pincode: string;
            registrationNumber: string;
            dateOfIncorporation: string;
            website: string;
        };
        contactPerson: {
            name: string;
            designation: string;
            mobile: string;
            email: string;
        };
        statutoryInfo: {
            panNumber: string;
            gstNumber: string;
            tanNumber: string;
        };
        technicalInfo?: {
            publicKey?: string;
        };
    };
}

// ─── Admin Hierarchy Types ────────────────────────────────────────────────────

export type AdminUserStatus = 'active' | 'disabled' | 'frozen' | 'pending';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: AdminLevel;
    department: string;
    status: AdminUserStatus;
    mfaEnabled: boolean;
    mfaType: 'FIDO2' | 'TOTP' | 'None';
    lastActive: string; // ISO timestamp
    jitActive?: boolean;
    jitExpiry?: string; // ISO timestamp
}

export type PendingChangeType = 'ADD_USER' | 'DELETE_USER';
export type PendingChangeStatus = 'pending' | 'approved' | 'rejected';

export interface PendingUserChange {
    id: string;
    type: PendingChangeType;
    requestedById: string;
    requestedByName: string;
    targetName: string;
    targetEmail: string;
    targetRole: AdminLevel;
    department: string;
    submittedAt: string; // ISO timestamp
    status: PendingChangeStatus;
    rejectionReason?: string;
    resolvedAt?: string;
}

export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditLogEntry {
    id: string;
    timestamp: string; // ISO
    actorId: string;
    actorName: string;
    actorLevel: AdminLevel;
    action: string;
    targetId?: string;
    targetName?: string;
    details: string;
    severity: AuditSeverity;
}

export type JITDuration = 30 | 60 | 120 | 240; // minutes

export interface JITElevationRequest {
    id: string;
    requesterId: string;
    requesterName: string;
    requesterRole: AdminLevel;
    reason: string;
    durationMinutes: JITDuration;
    requestedAt: string;
    approvedAt?: string;
    expiresAt?: string;
    status: 'pending' | 'active' | 'expired';
}

export interface SessionAction {
    timestamp: string;
    description: string;
}

export interface AdminSession {
    id: string;
    adminId: string;
    adminName: string;
    adminRole: AdminLevel;
    startTime: string;
    endTime?: string;
    durationMinutes: number;
    actionCount: number;
    actionsLog: SessionAction[];
}
