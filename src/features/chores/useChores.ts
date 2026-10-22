import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { fetchChoresData, type ChoresData } from "@/features/chores/api";

const empty: ChoresData = { chores: [], completions: [], members: [] };

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
