import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { mockChores, mockCompletions, mockMembers } from "@/mock/mockData";
import type { Chore, ChoreCompletion, HouseholdMember } from "@/types/database";

type ChoresData = {
  chores: Chore[];
  completions: ChoreCompletion[];
  members: HouseholdMember[];
};

const empty: ChoresData = { chores: [], completions: [], members: [] };

/** Byts mot Supabase när hushåll/login (#13, #16) finns. */
async function fetchChoresData(): Promise<ChoresData> {
  return {
    chores: mockChores.filter((c) => !c.archived),
    completions: mockCompletions,
    members: mockMembers,
  };
}

export function useChores() {
  const [data, setData] = useState<ChoresData>(empty);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setData(await fetchChoresData());
    setRefreshing(false);
  }, []);

  // Hämtar om varje gång man kommer tillbaka till vyn.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return { ...data, refreshing, refresh };
}
