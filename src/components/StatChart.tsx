import { StyleSheet, Text, View } from "react-native";

import { PieChart, type Slice } from "@/components/PieChart";
import { colors, typography } from "@/theme/colors";

type Props = { slices: Slice[]; label: string; large?: boolean };

export function StatChart({ slices, label, large }: Props) {
  return (
    <View style={large ? styles.large : styles.small}>
      <PieChart slices={slices} size={large ? 190 : 104} />
      <Text
        style={[styles.label, large && styles.largeLabel]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  large: { alignItems: "center", gap: 6, paddingVertical: 8 },
  small: { width: "33.33%", alignItems: "center", gap: 6, padding: 8 },
  label: { ...typography.small, color: colors.text },
  largeLabel: typography.subtitle,
});
