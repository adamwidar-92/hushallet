import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

async function fetchMembership(userId: string) {
  const { data, error } = await supabase
    .from("household_members")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export function useMembership() {
  const userId = useAuth().session?.user.id;

  return useQuery({
    queryKey: ["membership", userId],
    queryFn: () => fetchMembership(userId!),
    enabled: !!userId,
  });
}
