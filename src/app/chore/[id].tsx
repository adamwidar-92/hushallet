import { router, Stack, useLocalSearchParams } from "expo-router";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/Badge";
import { PillButton } from "@/components/PillButton";
import { useChores, useCompleteChore } from "@/features/chores/useChores";
import { colors, shadow, typography } from "@/theme/colors";

export default function ChoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { chores } = useChores();
  const complete = useCompleteChore();
  const chore = chores.find((c) => c.id === id);

  if (!chore) return null;

  const markDone = () =>
    complete.mutate(chore.id, { onSuccess: () => router.back() });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: chore.name }} />
      <View style={styles.card}>
        <Text style={styles.description}>{chore.description}</Text>
      </View>
      <InfoRow label="Återkommer:">
        <Text style={styles.description}>var</Text>
        <Badge value={chore.frequency_days} highlighted />
        <Text style={styles.description}>dag</Text>
      </InfoRow>
      <InfoRow label="Värde:">
        <Badge value={chore.weight} />
      </InfoRow>
      <PillButton
        title="Markera som gjord"
        icon="check-circle"
        onPress={markDone}
        disabled={complete.isPending}
      />
      {complete.error && (
        <Text style={styles.error}>{complete.error.message}</Text>
      )}
    </View>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={[styles.card, styles.row]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    gap: 12,
    backgroundColor: colors.background,
  },
  card: {
    padding: 18,
    borderRadius: 10,
    backgroundColor: colors.surface,
    ...shadow,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  label: { ...typography.taskTitle, color: colors.text },
  description: { fontSize: 16, color: colors.text },
  error: { ...typography.small, color: colors.danger, textAlign: "center" },
});
