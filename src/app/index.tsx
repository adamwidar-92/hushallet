import { NavigationBar } from "@/components/NavigationBar";
import { PillButton } from "@/components/PillButton";
import { TaskCard } from "@/components/TaskCard";
import { TaskStatus } from "@/components/TaskStatus";
import { getChoreStatus } from "@/features/chores/status";
import { useChores } from "@/features/chores/useChores";
import { useHousehold } from "@/features/household/useHousehold";
import { useMembership } from "@/features/household/useMembership";
import { filterByPeriod, getPeriod } from "@/features/statistics/period";
import { colors, typography } from "@/theme/colors";
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function TodayScreen() {
  const { chores, completions, members, error, refreshing, refresh } =
    useChores();
  const { household } = useHousehold();
  const isOwner = useMembership().data?.is_owner;
  const hasWeekStats =
    filterByPeriod(completions, getPeriod("currentWeek")).length > 0;

  return (
    <View style={styles.container}>
      <NavigationBar
        title={household?.name ?? "Hushållet"}
        subtitle="idag"
        onNext={hasWeekStats ? () => router.push("/statistics") : undefined}
        onTitlePress={() => router.push("/household")}
      />
      <FlatList
        data={chores}
        keyExtractor={(c) => c.id}
        extraData={completions}
        renderItem={({ item }) => (
          <TaskCard
            name={item.name}
            onPress={() => router.push(`/chore/${item.id}`)}
            right={
              <TaskStatus {...getChoreStatus(item, completions, members)} />
            }
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={refresh}
        ListEmptyComponent={
          <Text style={[styles.empty, error && styles.error]}>
            {error?.message ??
              "Inga sysslor än. En ägare kan lägga till sysslor."}
          </Text>
        }
      />
      {isOwner && (
        <View style={styles.footer}>
          <PillButton
            title="Lägg till"
            icon="plus-circle"
            onPress={() => router.push("/chore-form")}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 12, gap: 12 },
  empty: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 24,
  },
  error: { color: colors.danger },
  footer: { padding: 12 },
});
