import {
  mockChores,
  mockCompletions,
  mockCurrentUserId,
  mockMembers,
} from "@/mock/mockData";
import type { Chore, ChoreCompletion, HouseholdMember } from "@/types/database";

export type ChoresData = {
  chores: Chore[];
  completions: ChoreCompletion[];
  members: HouseholdMember[];
};

// Mockdata tills login/hushåll (#13, #16) finns. Byt bara innehållet i funktionerna mot Supabase.
export async function fetchChoresData(): Promise<ChoresData> {
  return {
    chores: mockChores.filter((c) => !c.archived),
    completions: [...mockCompletions],
    members: mockMembers,
  };
}

/** Supabase: supabase.from('chore_completions').insert({ chore_id, member_id: member.id }) */
export async function completeChore(choreId: string): Promise<void> {
  // member_id är användarens rad i household_members, inte user-id.
  const member = mockMembers.find((m) => m.user_id === mockCurrentUserId);
  if (!member) return;

  mockCompletions.unshift({
    id: `completion-${Date.now()}`,
    chore_id: choreId,
    member_id: member.id,
    completed_at: new Date().toISOString(),
  });
}
