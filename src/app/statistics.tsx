import { router, Stack } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { NavigationBar } from "@/components/NavigationBar";
import { StatChart } from "@/components/StatChart";
import { useChores } from "@/features/chores/useChores";
import { getStatistics } from "@/features/statistics/calc";
import { colors } from "@/theme/colors";

export default function StatisticsScreen() {
  const { chores, completions, members } = useChores();
  const { total, perChore } = getStatistics(chores, completions, members);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <NavigationBar
        title="Hushållet"
        subtitle="statistik"
        onPrev={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.body}>
        <StatChart slices={total} label="Totalt" large />
        <View style={styles.grid}>
          {perChore.map(({ chore, slices }) => (
            <StatChart key={chore.id} slices={slices} label={chore.name} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.statsBackground },
  body: { padding: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
});
