import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ChoreInput } from "@/components/ChoreForm";
import {
  completeChore,
  fetchChoresData,
  saveChore,
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

function useChoresMutation<T>(mutationFn: (variables: T) => Promise<void>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chores"] }),
  });
}

export function useCompleteChore() {
  const memberId = useMembership().data?.id;
  return useChoresMutation((choreId: string) =>
    completeChore(choreId, memberId!),
  );
}

export function useSaveChore() {
  const householdId = useMembership().data?.household_id;
  return useChoresMutation((chore: ChoreInput & { id?: string }) =>
    saveChore({ ...chore, household_id: householdId! }),
  );
}
