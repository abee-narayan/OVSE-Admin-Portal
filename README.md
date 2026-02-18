# OVSE Admin Portal

A high-fidelity, professional-grade governance and application review portal for the Unique Identification Authority of India (UIDAI).

## Project Overview

This portal facilitates a rigorous, 4-level approval workflow for OVSE registration applications. It is designed with a premium, UIDAI-compliant aesthetic and features a highly specialized experience tailored to each administrative level.

## Key Features

### 1. Differentiated RBAC Review Workflow
The system provides a governed, sequential review process across four distinct stages:
- **Level 1 (Recommendation Hub)**: Scrutiny of document integrity and eligibility.
- **Level 2 (Review Center)**: Deep-dive examination against regulatory policies.
- **Level 3 (Preapproval Dashboard)**: High-level risk profiling and directorate preparation.
- **Level 4 (Approval Portal)**: Final executive authorization for registration.

### 2. Premium UI & UX Experience
- **Dual-Pane Review Dialog**: A split-screen layout where application data is scrollable on the left, and role-specific actions/checklists are fixed on the right.
- **Role-Aware Design**: Headers, buttons, and task descriptions dynamically adjust based on the active user's level (e.g., "Scrutiny Checklist" for L1 vs. "Final Authorization" for L4).
- **Embedded Validation Checklists**: Pre-defined checks for each level to ensure thorough compliance and data integrity.

### 3. Technical Highlights
- **Framework**: Built with **Next.js 16 (App Router)** and **TypeScript**.
- **UI Components**: Hand-crafted layouts using **Tailwind CSS 4** and **Shadcn UI**.
- **Role Persistence**: Custom mock-auth implementation with `localStorage` synchronization to maintain role state during navigation.
- **Data Visualization**: Integrated **Recharts** for real-time efficiency tracking and administrative trends.

## Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Dashboard Access (Demo Links)
- [Level 1: Recommendation Hub](http://localhost:3000/dashboard/level_1)
- [Level 2: Review Center](http://localhost:3000/dashboard/level_2)
- [Level 3: Preapproval Dashboard](http://localhost:3000/dashboard/level_3)
- [Level 4: Approval Portal](http://localhost:3000/dashboard/level_4)

---
*Created for the Unique Identification Authority of India (UIDAI) governance framework.*
