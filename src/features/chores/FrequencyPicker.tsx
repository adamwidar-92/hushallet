import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { colors, shadow, typography } from '@/theme/colors';

/** "Återkommer väljare" från Figma: var X dag. Tryck -/+ för att ändra. */
export function FrequencyPicker({ value, onChange }: { value: number; onChange: (d: number) => void }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Återkommer:</Text>
      <View style={styles.row}>
        <Pressable accessibilityLabel="Färre dagar" hitSlop={8} onPress={() => onChange(Math.max(1, value - 1))}>
          <Text style={styles.step}>−</Text>
        </Pressable>
        <Text style={styles.text}>var</Text>
        <Badge value={value} highlighted />
        <Text style={styles.text}>dag</Text>
        <Pressable accessibilityLabel="Fler dagar" hitSlop={8} onPress={() => onChange(Math.min(365, value + 1))}>
          <Text style={styles.step}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadow,
    height: 55,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { ...typography.taskTitle, color: colors.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { fontSize: 18, color: colors.text },
  step: { fontSize: 22, color: colors.textMuted, paddingHorizontal: 4 },
});
