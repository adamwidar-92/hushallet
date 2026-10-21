import { NavigationBar } from "@/components/NavigationBar";
import { TaskCard } from "@/components/TaskCard";
import { TaskStatus } from "@/components/TaskStatus";
import { getChoreStatus } from "@/features/chores/status";
import { useChores } from "@/features/chores/useChores";
import { colors, typography } from "@/theme/colors";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function TodayScreen() {
  const { chores, completions, members, refreshing, refresh } = useChores();

  return (
    <View style={styles.container}>
      <NavigationBar title="Hushållet" subtitle="idag" />
      <FlatList
        data={chores}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <TaskCard
            name={item.name}
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
