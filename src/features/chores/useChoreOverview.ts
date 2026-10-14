import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { fetchChoreOverview, type ChoreOverview } from './api';
import { buildChoreStatuses, type ChoreStatus } from './status';

/** Hämtar sysslor + utföranden för hushållet och laddar om när skärmen får fokus. */
export function useChoreOverview(householdId: string | undefined) {
  const [data, setData] = useState<ChoreOverview | null>(null);
  const [statuses, setStatuses] = useState<ChoreStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!householdId) return;
    setLoading(true);
    try {
      const overview = await fetchChoreOverview(householdId);
      setData(overview);
      setStatuses(buildChoreStatuses(overview.chores, overview.completions, overview.members));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kunde inte hämta sysslor');
    } finally {
      setLoading(false);
    }
  }, [householdId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return { data, statuses, loading, error, reload: load };
}
