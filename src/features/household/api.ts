import { supabase } from '@/lib/supabase';
import type { AvatarEmoji, Household, HouseholdMember } from '@/types/database';

export type Membership = HouseholdMember & { household: Household | null };

export async function fetchMyMemberships(userId: string): Promise<Membership[]> {
  const { data, error } = await supabase
    .from('household_members')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');
  if (error) throw error;
  const members = data ?? [];
  const ids = members.map((m) => m.household_id);
  // Hushåll är bara läsbara för aktiva/pausade medlemmar (RLS); pending får null.
  const { data: households, error: hErr } = ids.length
    ? await supabase.from('households').select('*').in('id', ids)
    : { data: [] as Household[], error: null };
  if (hErr) throw hErr;
  return members.map((m) => ({ ...m, household: households?.find((h) => h.id === m.household_id) ?? null }));
}

export async function createHousehold(name: string, avatar: AvatarEmoji, color: string) {
  const { error } = await supabase.rpc('create_household', { p_name: name.trim(), p_avatar: avatar, p_color: color });
  if (error) throw error;
}

export async function requestJoin(code: string, avatar: AvatarEmoji, color: string) {
  const { error } = await supabase.rpc('request_join', { p_code: code.trim(), p_avatar: avatar, p_color: color });
  if (error) throw error;
}

export async function fetchTakenAvatars(code: string): Promise<AvatarEmoji[]> {
  const { data, error } = await supabase.rpc('taken_avatars', { p_code: code.trim() });
  if (error) throw error;
  return data ?? [];
}

export async function cancelRequest(memberId: string) {
  const { error } = await supabase.from('household_members').delete().eq('id', memberId);
  if (error) throw error;
}

export function friendlyError(e: unknown): string {
  const msg = e instanceof Error ? e.message : typeof e === 'object' && e && 'message' in e ? String(e.message) : String(e);
  if (msg.includes('invalid code')) return 'Ingen hushåll hittades med den koden.';
  if (msg.includes('household_members_household_id_avatar_key')) return 'Avataren är redan vald i hushållet.';
  if (msg.includes('household_members_household_id_user_id_key')) return 'Du har redan gått med eller skickat en förfrågan.';
  return msg;
}
