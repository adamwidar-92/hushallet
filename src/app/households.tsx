import { PillButton } from "@/components/PillButton";
import { useSelectedHousehold } from "@/context/HouseholdContext";
import { fetchMyHouseholds } from "@/features/household/api";
import { colors, shadow, typography } from "@/theme/colors";
import type { Household } from "@/types/database";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function HouseholdsScreen() {
  const router = useRouter();
  const { setHouseholdId } = useSelectedHousehold();
  const [households, setHouseholds] = useState<Household[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchMyHouseholds().then(setHouseholds).catch(() => setHouseholds([]));
    }, []),
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Mina hushåll" }} />
      <Text style={styles.heading}>Välj ett hushåll</Text>

      <FlatList
        data={households}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Du är inte med i något hushåll än</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => {
              setHouseholdId(item.id);
              router.push("/");
            }}
          >
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
      />

      <View style={styles.buttons}>
        <PillButton title="Skapa" icon="plus-circle" onPress={() => router.push("/create-household")} />
        <PillButton title="Gå med" icon="log-in" onPress={() => router.push("/join-household")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: colors.background },
  heading: { ...typography.subtitle, color: colors.text, marginBottom: 12 },
  list: { gap: 12 },
  card: { padding: 18, borderRadius: 10, backgroundColor: colors.surface, ...shadow },
  empty: { ...typography.small, color: colors.textMuted },
  name: { ...typography.taskTitle, color: colors.text },
  buttons: { flexDirection: "row", gap: 12, justifyContent: "center", paddingVertical: 12 },
});
