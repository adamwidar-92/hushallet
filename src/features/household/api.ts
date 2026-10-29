import { supabase } from "@/lib/supabase";
import { mockCurrentUserId, mockHousehold, mockMembers } from "@/mock/mockData";
import type { Avatar, Household } from "@/types/database";

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

export async function createHousehold(name: string, avatar: Avatar, color: string): Promise<Household> {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
        throw new Error("Fyll i ett namn");
    }

    const { data, error } = await supabase.rpc("create_household", {
        p_name: trimmed,
        p_avatar: avatar,
        p_color: color,
    });

    if (error) throw new Error("Kunde inte skapa hushållet");
    return data;
}