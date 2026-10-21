import { StyleSheet, Text } from "react-native";

import { Badge } from "@/components/Badge";
import type { ChoreStatus } from "@/features/chores/status";
import { typography } from "@/theme/colors";

/** Höger sida av ett Task Card: avatarer om gjord idag, annars badge med dagar sedan. */
export function TaskStatus({ doneBy, daysSince, overdue }: ChoreStatus) {
  if (doneBy.length > 0)
    return <Text style={styles.avatars}>{doneBy.join("")}</Text>;
  return <Badge value={daysSince} highlighted={overdue} />;
}

const styles = StyleSheet.create({
  avatars: typography.taskEmoji,
});
