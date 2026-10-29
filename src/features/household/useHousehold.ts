import { useSelectedHousehold } from "@/context/HouseholdContext";
import { fetchHousehold, fetchIsOwner, renameHousehold } from "@/features/household/api";
import type { Household } from "@/types/database";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useHousehold() {
    const [household, setHousehold] = useState<Household | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const { householdId } = useSelectedHousehold();

    const refresh = useCallback(async () => {
        setRefreshing(true);
        setHousehold(await fetchHousehold(householdId));
        setIsOwner(await fetchIsOwner(householdId));
        setRefreshing(false);
    }, [householdId]);

    const rename = useCallback(async (newName: string) => {
        await renameHousehold(newName, householdId);
        await refresh();
    }, [householdId, refresh]);

    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh]),
    );

    return { household, isOwner, refreshing, refresh, rename };
}
