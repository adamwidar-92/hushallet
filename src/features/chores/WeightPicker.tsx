import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { colors, shadow, typography } from '@/theme/colors';
import { CHORE_WEIGHTS, type ChoreWeight } from '@/types/database';

/** "Värde väljare" från Figma: hur energikrävande sysslan är (1/2/4/6/8). */
export function WeightPicker({ value, onChange }: { value: ChoreWeight; onChange: (w: ChoreWeight) => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.text}>
        <Text style={styles.title}>Värde:</Text>
        <Text style={styles.caption}>Hur energikrävande är sysslan?</Text>
      </View>
      <View style={styles.options}>
        {CHORE_WEIGHTS.map((w) => (
          <Pressable key={w} accessibilityLabel={`Värde ${w}`} onPress={() => onChange(w)} hitSlop={6}>
            <Badge value={w} highlighted={w === value} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadow,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 10,
  },
  text: { gap: 2 },
  title: { ...typography.taskTitle, color: colors.text },
  caption: { ...typography.caption, color: colors.text },
  options: { flexDirection: 'row', gap: 12 },
});
