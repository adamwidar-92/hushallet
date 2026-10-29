import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  completeChore,
  fetchChoresData,
  type ChoresData,
} from "@/features/chores/api";
import { useMembership } from "@/features/household/useMembership";

const empty: ChoresData = { chores: [], completions: [], members: [] };

export function useChores() {
  const householdId = useMembership().data?.household_id;

  const {
    data = empty,
    error,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["chores", householdId],
    queryFn: () => fetchChoresData(householdId!),
    enabled: !!householdId,
  });

  return { ...data, error, refreshing: isRefetching, refresh: refetch };
}

export function useCompleteChore() {
  const memberId = useMembership().data?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (choreId: string) => completeChore(choreId, memberId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chores"] }),
  });
}
