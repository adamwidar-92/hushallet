import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors, shadow, typography } from "@/theme/colors";

type Props = {
  name: string;
  right?: ReactNode;
  onPress?: () => void;
};

export function TaskCard({ name, right, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      {right}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 18,
    paddingRight: 13,
    borderRadius: 10,
    backgroundColor: colors.surface,
    ...shadow,
  },
  name: { ...typography.taskTitle, color: colors.text, flexShrink: 1 },
});
