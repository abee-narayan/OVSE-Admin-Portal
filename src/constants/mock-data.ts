import { Application, ApplicationStatus, AdminLevel } from "@/types";

// ─── Seed data ─────────────────────────────────────────────────────────────────
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

// ─── Seed DRAFT applications ───────────────────────────────────────────────────
const _now = Date.now();
const SEED_DRAFTS: Application[] = [
    {
        id: "DFT-001",
        entityName: "BharatPay Fintech Pvt. Ltd.",
        entityCategory: "Private Ltd.",
        submissionDate: "",
        status: ApplicationStatus.DRAFT,
        currentLevel: AdminLevel.LEVEL_1,
        recommendations: [],
        draftStartedAt: new Date(_now - 3 * 24 * 3600000).toISOString(),
        nudgedByL1Id: "l1-001",
        nudgedByL1Name: "John Scrutiny",
        nudgeTimestamp: new Date(_now - 1 * 24 * 3600000).toISOString(),
        data: {
            entityDetails: {
                address: "12-B, Connaught Place",
                state: "Delhi",
                pincode: "110001",
                registrationNumber: "U65999DL2021PTC123456",
                dateOfIncorporation: "05-03-2021",
                website: "https://bharatpay.in",
            },
            contactPerson: {
                name: "Arjun Mehta",
                designation: "CEO",
                mobile: "+91 9988776655",
                email: "arjun@bharatpay.in",
            },
            statutoryInfo: {
                panNumber: "AABCX1234Y",
                gstNumber: "07AABCX1234Y1ZK",
                tanNumber: "DELI12345A",
            },
        },
    },
    {
        id: "DFT-002",
        entityName: "Greenleaf Analytics LLP",
        entityCategory: "LLP",
        submissionDate: "",
        status: ApplicationStatus.DRAFT,
        currentLevel: AdminLevel.LEVEL_1,
        recommendations: [],
        draftStartedAt: new Date(_now - 5 * 24 * 3600000).toISOString(),
        data: {
            entityDetails: {
                address: "Sector 14, Gurugram",
                state: "Haryana",
                pincode: "122001",
                registrationNumber: "AAC-5623",
                dateOfIncorporation: "20-07-2019",
                website: "https://greenleaf.io",
            },
            contactPerson: {
                name: "Sunita Rawat",
                designation: "Partner",
                mobile: "+91 9876001122",
                email: "sunita@greenleaf.io",
            },
            statutoryInfo: {
                panNumber: "BCDEF9876G",
                gstNumber: "06BCDEF9876G1Z3",
                tanNumber: "GURX89012B",
            },
        },
    },
    {
        id: "DFT-003",
        entityName: "NorthStar Logistics",
        entityCategory: "Partnership",
        submissionDate: "",
        status: ApplicationStatus.DRAFT,
        currentLevel: AdminLevel.LEVEL_1,
        recommendations: [],
        draftStartedAt: new Date(_now - 8 * 24 * 3600000).toISOString(),
    },
    {
        id: "DFT-004",
        entityName: "KhedaConnect NGO",
        entityCategory: "NGO / Trust",
        submissionDate: "",
        status: ApplicationStatus.DRAFT,
        currentLevel: AdminLevel.LEVEL_1,
        recommendations: [],
        draftStartedAt: new Date(_now - 1 * 24 * 3600000).toISOString(),
    },
    // Pre-seeded LOW_QUALITY to demonstrate the L1 KPI penalty
    {
        id: "DFT-005",
        entityName: "Shady Ventures Pvt. Ltd.",
        entityCategory: "Private Ltd.",
        submissionDate: "10-02-2026",
        status: ApplicationStatus.LOW_QUALITY,
        currentLevel: AdminLevel.LEVEL_2,
        recommendations: [],
        draftStartedAt: new Date(_now - 20 * 24 * 3600000).toISOString(),
        nudgedByL1Id: "l1-001",
        nudgedByL1Name: "John Scrutiny",
        nudgeTimestamp: new Date(_now - 18 * 24 * 3600000).toISOString(),
        lowQualityFlag: true,
        lowQualityReason: "Incomplete statutory documentation; strong suspicion of misrepresented registration.",
    },
];

// ─── Mutable in-memory store ──────────────────────────────────────────────────
let applications: Application[] = [...SEED];
let drafts: Application[] = [...SEED_DRAFTS];

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

/** Get a live snapshot of all submitted applications */
export function getApplications(): Application[] {
    return applications;
}

/** Get a live snapshot of all draft applications (incl. LOW_QUALITY) */
export function getDraftApplications(): Application[] {
    return drafts;
}

/** L1 nudges a draft applicant — records their identity on the draft */
export function nudgeDraftApplicant(appId: string, l1Id: string, l1Name: string) {
    drafts = drafts.map(d =>
        d.id === appId && !d.nudgedByL1Id
            ? { ...d, nudgedByL1Id: l1Id, nudgedByL1Name: l1Name, nudgeTimestamp: new Date().toISOString() }
            : d
    );
    notify();
}

/**
 * L2 marks a submitted application as Low Quality — penalises the nudging L1.
 * Moves the record from the submitted pool into the drafts pool with LOW_QUALITY status.
 */
export function markLowQuality(appId: string, reason: string) {
    const app = applications.find(a => a.id === appId);
    if (app) {
        applications = applications.filter(a => a.id !== appId);
        drafts = [{ ...app, status: ApplicationStatus.LOW_QUALITY, lowQualityFlag: true, lowQualityReason: reason }, ...drafts];
        notify();
        return;
    }
    drafts = drafts.map(d =>
        d.id === appId
            ? { ...d, status: ApplicationStatus.LOW_QUALITY, lowQualityFlag: true, lowQualityReason: reason }
            : d
    );
    notify();
}

/** Compute KPI stats for a given L1 agent */
export function getL1KpiStats(l1Id: string) {
    const nudged = drafts.filter(d => d.nudgedByL1Id === l1Id);
    const converted = nudged.filter(d => d.status !== ApplicationStatus.DRAFT);
    const penalties = nudged.filter(d => d.lowQualityFlag);
    const score = nudged.length === 0
        ? 100
        : Math.max(0, Math.round(((converted.length - penalties.length * 2) / nudged.length) * 100));
    return {
        nudgedCount: nudged.length,
        convertedCount: converted.length,
        penaltyCount: penalties.length,
        nudgeScore: score,
    };
}

/** Leaderboard of all L1 agents who have nudged at least one draft */
export function getAllL1KpiStats(): { l1Id: string; l1Name: string; nudgedCount: number; convertedCount: number; penaltyCount: number; nudgeScore: number }[] {
    // Collect unique L1s who have nudged
    const seen = new Map<string, string>();
    for (const d of drafts) {
        if (d.nudgedByL1Id && d.nudgedByL1Name) {
            seen.set(d.nudgedByL1Id, d.nudgedByL1Name);
        }
    }
    return Array.from(seen.entries())
        .map(([l1Id, l1Name]) => ({ l1Id, l1Name, ...getL1KpiStats(l1Id) }))
        .sort((a, b) => b.nudgeScore - a.nudgeScore);
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
