import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme/colors";

type Props = {
  value: number | string;
  highlighted?: boolean;
};

/** Rund siffer-badge. Grå som standard, röd när `highlighted` (försenad/vald). */
export function Badge({ value, highlighted }: Props) {
  return (
    <View style={[styles.badge, highlighted && styles.highlighted]}>
      <Text style={[styles.text, highlighted && styles.highlightedText]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.badge,
  },
  highlighted: { backgroundColor: colors.overdue },
  text: { ...typography.small, color: colors.text },
  highlightedText: { color: colors.onOverdue },
});
