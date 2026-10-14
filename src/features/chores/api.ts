import { supabase } from '@/lib/supabase';
import type { Chore, ChoreCompletion, ChoreWeight, HouseholdMember } from '@/types/database';

export type ChoreOverview = {
  chores: Chore[];
  completions: ChoreCompletion[];
  members: HouseholdMember[];
};

export async function fetchChoreOverview(householdId: string): Promise<ChoreOverview> {
  const [choresRes, membersRes] = await Promise.all([
    supabase.from('chores').select('*').eq('household_id', householdId).eq('archived', false).order('name'),
    supabase.from('household_members').select('*').eq('household_id', householdId),
  ]);
  if (choresRes.error) throw choresRes.error;
  if (membersRes.error) throw membersRes.error;
  const chores = choresRes.data ?? [];
  const ids = chores.map((c) => c.id);
  const completionsRes = ids.length
    ? await supabase.from('chore_completions').select('*').in('chore_id', ids).order('completed_at', { ascending: false })
    : { data: [] as ChoreCompletion[], error: null };
  if (completionsRes.error) throw completionsRes.error;
  return { chores, completions: completionsRes.data ?? [], members: membersRes.data ?? [] };
}

export async function fetchChore(id: string): Promise<Chore | null> {
  const { data, error } = await supabase.from('chores').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export type NewChore = { name: string; description: string; frequency_days: number; weight: ChoreWeight };

export async function createChore(householdId: string, chore: NewChore) {
  const { error } = await supabase.from('chores').insert({ household_id: householdId, ...chore });
  if (error) throw error;
}

export async function markChoreDone(choreId: string, memberId: string) {
  const { error } = await supabase.from('chore_completions').insert({ chore_id: choreId, member_id: memberId });
  if (error) throw error;
}
