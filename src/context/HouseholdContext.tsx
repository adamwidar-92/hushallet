import { createContext, useContext, useState } from "react";

import { useAuth } from "@/context/AuthContext";

type HouseholdContextType = {
  householdId: string | null;
  setHouseholdId: (id: string | null) => void;
};

const HouseholdContext = createContext<HouseholdContextType>({
  householdId: null,
  setHouseholdId: () => {},
});

export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  const userId = useAuth().session?.user.id;
  const [selected, setSelected] = useState<{ userId?: string; id: string | null }>({ id: null });

  const householdId = selected.userId === userId ? selected.id : null;
  const setHouseholdId = (id: string | null) => setSelected({ userId, id });

  return (
    <HouseholdContext.Provider value={{ householdId, setHouseholdId }}>
      {children}
    </HouseholdContext.Provider>
  );
}

export function useSelectedHousehold() {
  return useContext(HouseholdContext);
}
