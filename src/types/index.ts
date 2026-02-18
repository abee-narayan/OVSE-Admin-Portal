export enum AdminLevel {
    LEVEL_1 = 'LEVEL_1', // Initial scrutiny
    LEVEL_2 = 'LEVEL_2', // Examination (ASO/SO)
    LEVEL_3 = 'LEVEL_3', // Review & Recommendation (AD/DD)
    LEVEL_4 = 'LEVEL_4', // Final Approval (Director)
}

export enum ApplicationStatus {
    PENDING = 'PENDING',
    UNDER_SCRUTINY = 'UNDER_SCRUTINY', // Level 1
    UNDER_EXAMINATION = 'UNDER_EXAMINATION', // Level 2
    UNDER_REVIEW = 'UNDER_REVIEW', // Level 3
    PENDING_FINAL_APPROVAL = 'PENDING_FINAL_APPROVAL', // Level 4
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CORRECTION_REQUIRED = 'CORRECTION_REQUIRED',
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
    };
}
