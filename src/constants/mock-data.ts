import { Application, ApplicationStatus, AdminLevel } from "@/types";

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED: Application[] = [
    {
        id: "APP-001",
        entityName: "Innovate Inc.",
        entityCategory: "Private Organization",
        submissionDate: "15-08-2025",
        status: ApplicationStatus.SUBMITTED,
        currentLevel: AdminLevel.LEVEL_1,
        recommendations: [],
        data: {
            entityDetails: {
                address: "Plot 12, Sector 5, Hitech City",
                state: "Telangana",
                pincode: "500081",
                registrationNumber: "U72200TG2020PTC123456",
                dateOfIncorporation: "12-01-2020",
                website: "https://innovateinc.com",
            },
            contactPerson: {
                name: "Rahul Sharma",
                designation: "Managing Director",
                mobile: "+91 9876543210",
                email: "rahul@innovateinc.com",
            },
            statutoryInfo: {
                panNumber: "ABCDE1234F",
                gstNumber: "36ABCDE1234F1Z5",
                tanNumber: "CHNA12345B",
            },
        },
    },
    {
        id: "APP-002",
        entityName: "Tech Solutions",
        entityCategory: "LLP",
        submissionDate: "16-08-2025",
        status: ApplicationStatus.L1_APPROVED,
        currentLevel: AdminLevel.LEVEL_2,
        recommendations: [
            {
                level: AdminLevel.LEVEL_1,
                recommenderId: "l1-001",
                action: "APPROVE",
                comments: "All documents verified. Organisation structure is clear.",
                timestamp: "2025-08-16T10:00:00Z",
            },
        ],
    },
    {
        id: "APP-003",
        entityName: "Global Corp",
        entityCategory: "Public Limited",
        submissionDate: "17-08-2025",
        status: ApplicationStatus.L1_REJECTED,
        currentLevel: AdminLevel.LEVEL_3,
        recommendations: [],
    },
    {
        id: "APP-004",
        entityName: "OVSE Name",
        entityCategory: "Partnership",
        submissionDate: "18-08-2025",
        status: ApplicationStatus.ACTIVE,
        currentLevel: AdminLevel.LEVEL_4,
        recommendations: [],
    },
    {
        id: "APP-005",
        entityName: "Director's Hub",
        entityCategory: "Government Agency",
        submissionDate: "19-08-2025",
        status: ApplicationStatus.L2_APPROVED,
        currentLevel: AdminLevel.LEVEL_3,
        recommendations: [
            {
                level: AdminLevel.LEVEL_1,
                recommenderId: "l1-002",
                action: "APPROVE",
                comments: "Initial scrutiny passed. Documents are in order.",
                timestamp: "2025-08-19T09:00:00Z",
            },
            {
                level: AdminLevel.LEVEL_2,
                recommenderId: "l2-002",
                action: "APPROVE",
                comments: "Examination confirmed legitimacy. Recommend review.",
                timestamp: "2025-08-19T11:00:00Z",
            },
            {
                level: AdminLevel.LEVEL_3,
                recommenderId: "l3-002",
                action: "APPROVE",
                comments: "AD review complete. Forwarding to Director for final sign-off.",
                timestamp: "2025-08-19T14:00:00Z",
            },
        ],
    },
];

// ─── Mutable in-memory store ──────────────────────────────────────────────────
let applications: Application[] = [...SEED];

// Listeners for reactive updates
const listeners = new Set<() => void>();

function notify() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("app-store-update"));
    }
    listeners.forEach(fn => fn());
}

/** Keep for the old import path that ApplicationTable uses */
export const MOCK_APPLICATIONS = applications;

/** Get a live snapshot of all applications */
export function getApplications(): Application[] {
    return applications;
}

/** Persist an updated application returned by processAction */
export function commitApplicationUpdate(updated: Application) {
    applications = applications.map(a => (a.id === updated.id ? updated : a));
    notify();
}

/** Subscribe to store changes (returns unsubscribe fn) */
export function subscribeApplications(fn: () => void): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
}
