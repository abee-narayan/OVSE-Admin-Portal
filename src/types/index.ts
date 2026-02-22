export enum AdminLevel {
    LEVEL_1 = 'LEVEL_1', // Initial scrutiny
    LEVEL_2 = 'LEVEL_2', // Examination (ASO/SO)
    LEVEL_3 = 'LEVEL_3', // Review & Recommendation (AD/DD)
    LEVEL_4 = 'LEVEL_4', // Final Approval (Director)
}

export enum ApplicationStatus {
    SUBMITTED = 'SUBMITTED', // Initial scrutiny
    L1_REJECTED = 'L1_REJECTED', // Rejected at Level 1 (Back to Entity)
    L1_APPROVED = 'L1_APPROVED', // Moves to L2
    L2_APPROVED = 'L2_APPROVED', // Moves to L3
    ACTIVE = 'ACTIVE', // L3 approved + Client ID generated
    REVOKED = 'REVOKED', // Revoked by L4 Action
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
