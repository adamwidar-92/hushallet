import { fetchHousehold, renameHousehold } from "@/features/household/api";
import type { Household } from "@/types/database";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useHousehold(){
    const [household, setHousehold] = useState<Household | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const refresh = useCallback(async () => {
        setRefreshing(true);
        setHousehold(await fetchHousehold());
        setRefreshing(false);
    }, []);

    const rename = useCallback(async (newName: string) => {
        await renameHousehold(newName);
        await refresh();
    }, [refresh]);

    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh]),
    );

    return {household, refreshing, refresh, rename};
}
