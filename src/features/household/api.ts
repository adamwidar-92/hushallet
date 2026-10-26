import { mockCurrentUserId, mockHousehold, mockMembers } from "@/mock/mockData";
import type { Household } from "@/types/database";

export async function fetchHousehold(): Promise<Household> {
    return { ...mockHousehold };
}

export async function renameHousehold(newName: string): Promise<void> {
    const name = newName.trim();

    if (name.length === 0) {
        throw new Error("Fyll i ett namn")
    }
    mockHousehold.name = name;
}

export async function fetchIsOwner(): Promise<boolean> {
    const me = mockMembers.find((m) => m.user_id === mockCurrentUserId);
    return me?.is_owner ?? false;
}