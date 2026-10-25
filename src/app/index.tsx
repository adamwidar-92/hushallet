import { NavigationBar } from "@/components/NavigationBar";
import { TaskCard } from "@/components/TaskCard";
import { TaskStatus } from "@/components/TaskStatus";
import { getChoreStatus } from "@/features/chores/status";
import { useChores } from "@/features/chores/useChores";
import { useHousehold } from "@/features/household/useHousehold";
import { filterByPeriod, getPeriod } from "@/features/statistics/period";
import { colors, typography } from "@/theme/colors";
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function TodayScreen() {
  const { chores, completions, members, refreshing, refresh } = useChores();
  const { household } = useHousehold();
  const hasWeekStats =
    filterByPeriod(completions, getPeriod("currentWeek")).length > 0;

  return (
    <View style={styles.container}>
      <NavigationBar
        title={household?.name ?? "Hushållet"}
        subtitle="idag"
        onNext={hasWeekStats ? () => router.push("/statistics") : undefined}
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
          <Text style={styles.empty}>
            Inga sysslor än. En ägare kan lägga till sysslor.
          </Text>
        }
      />
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
});
