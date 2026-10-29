import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import { useSelectedHousehold } from "@/context/HouseholdContext";
import { supabase } from "@/lib/supabase";

async function fetchMembership(userId: string, householdId: string | null) {
  let query = supabase
    .from("household_members")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active");
  if (householdId) query = query.eq("household_id", householdId);
  const { data, error } = await query.limit(1).maybeSingle();
  if (error) throw error;
  return data;
}

export function useMembership() {
  const userId = useAuth().session?.user.id;
  const { householdId } = useSelectedHousehold();

  return useQuery({
    queryKey: ["membership", userId, householdId],
    queryFn: () => fetchMembership(userId!, householdId),
    enabled: !!userId,
  });
}
