import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';

import { fetchMyMemberships, type Membership } from './api';

type HouseholdState = {
  loading: boolean;
  /** Aktivt hushåll (första aktiva/pausade medlemskapet). */
  current: Membership | null;
  /** Förfrågningar som väntar på godkännande. */
  pending: Membership[];
  refresh: () => Promise<void>;
};

const HouseholdContext = createContext<HouseholdState | null>(null);

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [memberships, setMemberships] = useState<Membership[]>([]);
  // Vilken användare datan senast laddades för; laddar tills den matchar inloggad användare.
  const [loadedFor, setLoadedFor] = useState<string | null | undefined>(undefined);
  const loading = loadedFor !== (userId ?? null);

  const refresh = useCallback(async () => {
    let next: Membership[] = [];
    if (userId) {
      try {
        next = await fetchMyMemberships(userId);
      } catch (e) {
        console.warn('Kunde inte hämta hushåll', e);
      }
    }
    setMemberships(next);
    setLoadedFor(userId ?? null);
  }, [userId]);

  useEffect(() => {
    // Datahämtning vid inloggning/utloggning.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const current = memberships.find((m) => m.status !== 'pending' && m.household) ?? null;
  const pending = memberships.filter((m) => m.status === 'pending');

  return (
    <HouseholdContext.Provider value={{ loading, current, pending, refresh }}>{children}</HouseholdContext.Provider>
  );
}

export function useHousehold() {
  const ctx = useContext(HouseholdContext);
  if (!ctx) throw new Error('useHousehold måste användas inom HouseholdProvider');
  return ctx;
}
