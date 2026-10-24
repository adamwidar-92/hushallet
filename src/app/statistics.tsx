import { router, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import { NavigationBar } from "@/components/NavigationBar";
import { PieChart } from "@/components/PieChart";
import { useChores } from "@/features/chores/useChores";
import { getDistribution } from "@/features/statistics/calc";
import { colors } from "@/theme/colors";

export default function StatisticsScreen() {
  const { completions, members } = useChores();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <NavigationBar
        title="Hushållet"
        subtitle="statistik"
        onPrev={() => router.back()}
      />
      <View style={styles.body}>
        <PieChart slices={getDistribution(completions, members)} size={190} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.statsBackground },
  body: { alignItems: "center", padding: 12 },
});
