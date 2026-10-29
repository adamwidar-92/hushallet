import { supabase } from "@/lib/supabase";
import type { Chore, ChoreCompletion, HouseholdMember } from "@/types/database";

export type ChoresData = {
  chores: Chore[];
  completions: ChoreCompletion[];
  members: HouseholdMember[];
};

function unwrap<T>({
  data,
  error,
}: {
  data: T | null;
  error: Error | null;
}): T {
  if (error) throw error;
  return data as T;
}

export async function fetchChoresData(
  householdId: string,
): Promise<ChoresData> {
  const [chores, members] = await Promise.all([
    supabase
      .from("chores")
      .select("*")
      .eq("household_id", householdId)
      .eq("archived", false)
      .then(unwrap),
    supabase
      .from("household_members")
      .select("*")
      .eq("household_id", householdId)
      .then(unwrap),
  ]);

  const completions = await supabase
    .from("chore_completions")
    .select("*")
    .in(
      "chore_id",
      chores.map((c) => c.id),
    )
    .then(unwrap);

  return { chores, completions, members };
}

export async function completeChore(choreId: string, memberId: string) {
  unwrap(
    await supabase
      .from("chore_completions")
      .insert({ chore_id: choreId, member_id: memberId }),
  );
}
