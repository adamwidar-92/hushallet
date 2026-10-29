import { supabase } from "@/lib/supabase";
import type { Avatar, Household, HouseholdMember } from "@/types/database";

// Hämtar den inloggades rad i household_members (eller null om inget hushåll)
async function fetchMyMembership(householdId?: string | null): Promise<HouseholdMember | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    let query = supabase
        .from("household_members")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active");
    if (householdId) query = query.eq("household_id", householdId);
    const { data, error } = await query.limit(1).maybeSingle();

    if (error) throw new Error("Kunde inte hämta medlemskap");
    return data;
}

export async function fetchHousehold(householdId?: string | null): Promise<Household | null> {
    const me = await fetchMyMembership(householdId);
    if (!me) return null;

    const { data, error } = await supabase
        .from("households")
        .select("*")
        .eq("id", me.household_id)
        .single();

    if (error) throw new Error("Kunde inte hämta hushållet");
    return data;
}

export async function renameHousehold(newName: string, householdId?: string | null): Promise<void> {
    const name = newName.trim();
    if (name.length === 0) {
        throw new Error("Fyll i ett namn");
    }

    const me = await fetchMyMembership(householdId);
    if (!me) throw new Error("Du tillhör inget hushåll");

    const { error } = await supabase
        .from("households")
        .update({ name })
        .eq("id", me.household_id);

    if (error) throw new Error("Kunde inte byta namn");
}

export async function fetchIsOwner(householdId?: string | null): Promise<boolean> {
    const me = await fetchMyMembership(householdId);
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
        if (error.code === "23505") throw new Error("Avataren är upptagen eller så är du redan med i hushållet");
        throw new Error("Kunde inte gå med i hushållet");
    }
    return data;
}

export type MyHousehold = Household & { memberCount: number; isOwner: boolean };

export async function fetchMyHouseholds(): Promise<MyHousehold[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: members, error } = await supabase
        .from("household_members")
        .select("household_id, is_owner")
        .eq("user_id", user.id)
        .eq("status", "active");
    if (error) throw new Error("Kunde inte hämta hushållen");
    if (!members.length) return [];

    const ids = members.map((m) => m.household_id);
    const [households, all] = await Promise.all([
        supabase.from("households").select("*").in("id", ids),
        supabase.from("household_members").select("household_id").in("household_id", ids).eq("status", "active"),
    ]);
    if (households.error || all.error) throw new Error("Kunde inte hämta hushållen");

    return households.data.map((h) => ({
        ...h,
        memberCount: all.data.filter((m) => m.household_id === h.id).length,
        isOwner: members.some((m) => m.household_id === h.id && m.is_owner),
    }));
}

export async function fetchProfileNames(userIds: string[]): Promise<Record<string, string>> {
    if (!userIds.length) return {};
    const { data, error } = await supabase.from("profiles").select("id, name").in("id", userIds);
    if (error) return {};
    return Object.fromEntries(data.map((p) => [p.id, p.name]));
}
