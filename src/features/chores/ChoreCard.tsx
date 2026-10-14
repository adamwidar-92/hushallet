import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { colors, shadow, typography } from '@/theme/colors';

import type { ChoreStatus } from './status';

/** "Task Card" från Figma: namn till vänster, avatarer (gjord idag) eller dagar-badge till höger. */
export function ChoreCard({ status, onPress }: { status: ChoreStatus; onPress: () => void }) {
  const { chore, doneTodayBy, daysSince, overdue } = status;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${chore.name}${overdue ? ', försenad' : ''}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Text style={styles.name} numberOfLines={1}>
        {chore.name}
      </Text>
      {doneTodayBy.length > 0 ? (
        <View style={styles.avatars}>
          {doneTodayBy.map((d) => (
            <Text key={d.avatar} style={styles.emoji}>
              {d.avatar}
            </Text>
          ))}
        </View>
      ) : (
        <Badge value={daysSince} highlighted={overdue} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadow,
    height: 55,
    borderRadius: 10,
    backgroundColor: colors.surface,
    paddingLeft: 18,
    paddingRight: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  pressed: { opacity: 0.7 },
  name: { ...typography.taskTitle, color: colors.text, flex: 1 },
  avatars: { flexDirection: 'row' },
  emoji: { ...typography.taskEmoji, width: 24, textAlign: 'center' },
});
