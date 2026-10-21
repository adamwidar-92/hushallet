import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { mockChores } from "@/mock/mockData";
import type { Chore } from "@/types/database";

/** Byts mot Supabase när hushåll/login (#13, #16) finns. */
async function fetchChores(): Promise<Chore[]> {
  return mockChores.filter((c) => !c.archived);
}

export function useChores() {
  const [chores, setChores] = useState<Chore[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setChores(await fetchChores());
    setRefreshing(false);
  }, []);

  // Hämtar om varje gång man kommer tillbaka till vyn.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return { chores, refreshing, refresh };
}
