import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/Badge";
import { colors, shadow, typography } from "@/theme/colors";
import { CHORE_WEIGHTS, type ChoreWeight } from "@/types/database";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

type PickerProps<T> = { value: T; onChange: (value: T) => void };

function BadgeOptions<T extends number>({
  options,
  value,
  onChange,
}: PickerProps<T> & { options: readonly T[] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.options}
    >
      {options.map((option) => (
        <Pressable key={option} onPress={() => onChange(option)} hitSlop={8}>
          <Badge value={option} highlighted={option === value} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function FrequencyPicker({ value, onChange }: PickerProps<number>) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Återkommer:</Text>
        <Pressable style={styles.row} onPress={() => setOpen(!open)}>
          <Text style={styles.text}>var</Text>
          <Badge value={value} highlighted />
          <Text style={styles.text}>dag</Text>
        </Pressable>
      </View>
      {open && (
        <BadgeOptions
          options={DAYS}
          value={value}
          onChange={(days) => {
            onChange(days);
            setOpen(false);
          }}
        />
      )}
    </View>
  );
}

export function WeightPicker({ value, onChange }: PickerProps<ChoreWeight>) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>Värde:</Text>
        <Text style={styles.hint}>Hur energikrävande är sysslan?</Text>
      </View>
      <BadgeOptions options={CHORE_WEIGHTS} value={value} onChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    gap: 12,
    borderRadius: 10,
    backgroundColor: colors.surface,
    ...shadow,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  options: { gap: 12 },
  label: { ...typography.taskTitle, color: colors.text },
  hint: { ...typography.caption, color: colors.textMuted },
  text: { fontSize: 16, color: colors.text },
});
