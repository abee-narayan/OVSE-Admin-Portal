import { AdminLevel, Application, ApplicationStatus } from "@/types";
import { validateApplication } from "./validation-service";

// Native UUID generator fallback since external 'uuid' is not installed
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export interface ActionPayload {
    action: 'APPROVE' | 'REJECT' | 'CORRECTION';
    comments?: string;
    isFtr?: boolean;
    revocationReason?: string;
}

// Helper to generate a mock x509 cert based on a public key
const generateMockX509Cert = (publicKey: string | undefined): string => {
    if (!publicKey) return "MOCK_CERT_NO_PUB_KEY";
    return `-----BEGIN CERTIFICATE-----\nMOCK_X509_CERT_GENERATED_VIA_OVSE_PRIVATE_KEY\nSUBJECT_PUB_KEY:${publicKey.substring(0, 15)}...\n-----END CERTIFICATE-----`;
}

export const processAction = (
    application: Application,
    userRole: AdminLevel,
    userId: string,
    payload: ActionPayload
): Application => {
    const updatedApp = { ...application };
    const timestamp = new Date().toISOString();

    // Record the recommendation
    if (!updatedApp.recommendations) updatedApp.recommendations = [];
    updatedApp.recommendations.push({
        level: userRole,
        recommenderId: userId,
        action: payload.action,
        comments: payload.comments || "",
        timestamp
    });

    switch (userRole) {
        case AdminLevel.LEVEL_1: // Scrutiny
            if (payload.action === 'APPROVE') {
                updatedApp.status = ApplicationStatus.L1_APPROVED;
                updatedApp.currentLevel = AdminLevel.LEVEL_2;
                updatedApp.l1_approved_by = userId;

                // FTR logic driven by user checkbox payload (or fallback to auto)
                const validationResult = validateApplication(application);
                updatedApp.is_ftr = (payload.isFtr !== undefined) ? payload.isFtr : validationResult.passed;

            } else if (payload.action === 'CORRECTION') {
                updatedApp.status = ApplicationStatus.L1_REJECTED; // Using L1_REJECTED for send back
                updatedApp.l1_comments = payload.comments;
            } else {
                updatedApp.status = ApplicationStatus.L1_REJECTED;
                updatedApp.l1_comments = payload.comments;
            }
            break;

        case AdminLevel.LEVEL_2: // Examination
            if (payload.action === 'APPROVE') {
                updatedApp.status = ApplicationStatus.L2_APPROVED;
                updatedApp.currentLevel = AdminLevel.LEVEL_3;
                updatedApp.l2_approved_by = userId;
            } else {
                updatedApp.status = ApplicationStatus.L1_REJECTED; // Sends back
            }
            break;

        case AdminLevel.LEVEL_3: // Final Approval / Client ID Handover
            if (payload.action === 'APPROVE') {
                updatedApp.status = ApplicationStatus.ACTIVE; // L3 approved + Client ID generated
                updatedApp.currentLevel = AdminLevel.LEVEL_4; // Passes to L4 for audit visibility
                updatedApp.l3_approved_by = userId;

                // EPIC 3: Fulfillment & Client ID Generation
                // Generate a true UUID for client_id
                updatedApp.client_id = generateUUID();
                updatedApp.x509_certificate = generateMockX509Cert(application.data?.technicalInfo?.publicKey);

                // [MOCK] Simulate webhook to OVSE portal — no real network call in demo
                console.log(`[Webhook Simulation] L3 Approved → OVSE portal notified`, {
                    client_id: updatedApp.client_id,
                    entityName: updatedApp.entityName,
                    status: 'ACTIVE',
                    certificate: updatedApp.x509_certificate,
                });

            } else {
                updatedApp.status = ApplicationStatus.L1_REJECTED; // Send back to start or previous level
            }
            break;

        case AdminLevel.LEVEL_4: // Final Approval / Audit / Revoke
            // L4 can revoke an already approved application
            if (payload.action === 'REJECT') { // We use reject action as Revoke from UI
                updatedApp.status = ApplicationStatus.REVOKED;
                updatedApp.revoked_at = timestamp;
                updatedApp.revocationReason = payload.comments;
                // TODO: Trigger Revocation Mock Webhook
                console.log(`[Webhook Simulation] Application Revoked: ${updatedApp.id}`);
            }
            break;
    }

    return updatedApp;
};
