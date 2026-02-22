import { Application } from "@/types";

export interface ValidationResult {
    passed: boolean;
    confidence: 'High Confidence' | 'Needs Attention';
    flags: {
        field: string;
        message: string;
        isError: boolean;
    }[];
}

// Mock validation service to automatically flag technical requirements
export const validateApplication = (application: Application): ValidationResult => {
    const flags: ValidationResult["flags"] = [];
    let passed = true;

    // 1. Mandatory Docs Check
    // In a real app we would check if the URL/file path exists
    // For mock purposes, we assume documents exist, but let's flag if some data is entirely missing
    if (!application.data?.entityDetails.website) {
        flags.push({ field: "Website", message: "Website URL is missing.", isError: true });
        passed = false;
    }

    // 2. Callback URL HTTPS check (we use website as a proxy for callback URL in this mock model)
    const urlToCheck = application.data?.entityDetails.website || "";
    if (urlToCheck && !urlToCheck.toLowerCase().startsWith("https://")) {
        flags.push({ field: "Callback URL", message: "Must start with https:// for security.", isError: true });
        passed = false;
    } else if (urlToCheck) {
        flags.push({ field: "Callback URL", message: "Valid HTTPS URL", isError: false });
    }

    // 3. Document Checks (Logo SVG & <10KB)
    // We will mock this response for the UI demonstration
    flags.push({ field: "Logo Format", message: "Format is SVG.", isError: false });
    flags.push({ field: "Logo Size", message: "Size is <10KB.", isError: false });


    // 4. Public Certificate Validity Check (> 730 days)
    // We mock that the cert is valid
    flags.push({ field: "Public Certificate", message: "Expiry is > 730 days from today.", isError: false });


    // 5. GST Format validation (Basic regex for Indian GST format: 2 nums, 5 chars, 4 nums, 1 char, 1 num, Z, 1 char/num)
    const gst = application.data?.statutoryInfo.gstNumber;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (gst) {
        if (!gstRegex.test(gst)) {
            flags.push({ field: "GST Number", message: "Invalid GST format detected.", isError: true });
            passed = false;
        } else {
            flags.push({ field: "GST Number", message: "Valid GST Format", isError: false });
        }
    } else {
        flags.push({ field: "GST Number", message: "GST Number missing.", isError: true });
        passed = false;
    }

    const confidence = passed ? 'High Confidence' : 'Needs Attention';
    return { passed, confidence, flags };
};
