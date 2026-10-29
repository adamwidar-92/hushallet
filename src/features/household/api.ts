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