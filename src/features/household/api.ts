import { supabase } from "@/lib/supabase";
import type { Avatar, Household, HouseholdMember } from "@/types/database";

// Hämtar den inloggades rad i household_members (eller null om inget hushåll)
async function fetchMyMembership(): Promise<HouseholdMember | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from("household_members")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();

    if (error) throw new Error("Kunde inte hämta medlemskap");
    return data;
}

export async function fetchHousehold(): Promise<Household | null> {
    const me = await fetchMyMembership();
    if (!me) return null;

    const { data, error } = await supabase
        .from("households")
        .select("*")
        .eq("id", me.household_id)
        .single();

    if (error) throw new Error("Kunde inte hämta hushållet");
    return data;
}

export async function renameHousehold(newName: string): Promise<void> {
    const name = newName.trim();
    if (name.length === 0) {
        throw new Error("Fyll i ett namn");
    }

    const me = await fetchMyMembership();
    if (!me) throw new Error("Du tillhör inget hushåll");

    const { error } = await supabase
        .from("households")
        .update({ name })
        .eq("id", me.household_id);

    if (error) throw new Error("Kunde inte byta namn");
}

export async function fetchIsOwner(): Promise<boolean> {
    const me = await fetchMyMembership();
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

export async function fetchTakenAvatars(code: string): Promise<Avatar[]> {
    const { data, error } = await supabase.rpc("taken_avatars", { p_code: code });
    if (error) return [];
    return data ?? [];
}

export async function requestJoin(code: string, avatar: Avatar, color: string): Promise<HouseholdMember> {
    const trimmed = code.trim();
    if (trimmed.length === 0) {
        throw new Error("Fyll i en kod");
    }

    const { data, error } = await supabase.rpc("request_join", {
        p_code: trimmed,
        p_avatar: avatar,
        p_color: color,
    });

    if (error) {
        if (error.message.includes("invalid code")) throw new Error("Hittade inget hushåll med den koden");
        if (error.code === "23505") throw new Error("Avataren är upptagen eller du har redan skickat en förfrågan");
        throw new Error("Kunde inte gå med i hushållet");
    }
    return data;
}

export async function cancelJoin(memberId: string): Promise<void> {
    const { error } = await supabase.from("household_members").delete().eq("id", memberId);
    if (error) throw new Error("Kunde inte avbryta förfrågan");
}
export async function fetchMyHouseholds(): Promise<Household[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: members, error } = await supabase
        .from("household_members")
        .select("household_id")
        .eq("user_id", user.id)
        .eq("status", "active");
    if (error) throw new Error("Kunde inte hämta hushållen");
    if (!members.length) return [];

    const { data, error: householdsError } = await supabase
        .from("households")
        .select("*")
        .in("id", members.map((m) => m.household_id));
    if (householdsError) throw new Error("Kunde inte hämta hushållen");
    return data;
}
