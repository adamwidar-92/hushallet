import { useHousehold } from "@/features/household/useHousehold";
import { colors, shadow, typography } from "@/theme/colors";
import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function HouseholdScreen() {
  const { household } = useHousehold();

  if (!household) return null;
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: household.name }} />

      <View style={styles.card}>
        <Text style={styles.label}>Kod för att gå med</Text>
        <Text style={styles.code}>{household.join_code}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, gap: 12, backgroundColor: colors.background },
  card: { padding: 18, borderRadius: 10, backgroundColor: colors.surface, ...shadow },
  label: { ...typography.small, color: colors.textMuted },
  code: { fontSize: 32, fontWeight: "700", letterSpacing: 4, color: colors.text },
});