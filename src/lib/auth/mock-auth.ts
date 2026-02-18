import { AdminLevel, User } from "@/types";

const MOCK_USERS: Record<AdminLevel, User> = {
    [AdminLevel.LEVEL_1]: {
        id: "l1-001",
        name: "John Scrutiny",
        email: "l1@uidai.gov.in",
        role: AdminLevel.LEVEL_1,
    },
    [AdminLevel.LEVEL_2]: {
        id: "l2-001",
        name: "Alice Examiner",
        email: "l2@uidai.gov.in",
        role: AdminLevel.LEVEL_2,
    },
    [AdminLevel.LEVEL_3]: {
        id: "l3-001",
        name: "Bob Reviewer",
        email: "l3@uidai.gov.in",
        role: AdminLevel.LEVEL_3,
    },
    [AdminLevel.LEVEL_4]: {
        id: "l4-001",
        name: "Director General",
        email: "director@uidai.gov.in",
        role: AdminLevel.LEVEL_4,
    },
};

export { MOCK_USERS };

export const getUserForRole = (role: AdminLevel): User => {
    return MOCK_USERS[role];
};

// Role switching for demo purposes
export const setCurrentRole = (role: AdminLevel) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('activeRole', role);
    }
};

export const getCurrentUser = (): User => {
    if (typeof window !== 'undefined') {
        const savedRole = localStorage.getItem('activeRole') as AdminLevel;
        if (savedRole && MOCK_USERS[savedRole]) {
            return MOCK_USERS[savedRole];
        }
    }
    return MOCK_USERS[AdminLevel.LEVEL_1];
};
