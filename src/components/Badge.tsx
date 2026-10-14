import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme/colors';

/** Rund siffer-badge ("Open"/"Due" i Figma). Röd när den är markerad. */
export function Badge({ value, highlighted }: { value: number | string; highlighted?: boolean }) {
  return (
    <View style={[styles.badge, highlighted && styles.highlighted]}>
      <Text style={[styles.text, highlighted && styles.highlightedText]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: colors.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlighted: { backgroundColor: colors.overdue },
  text: { ...typography.small, color: colors.text },
  highlightedText: { color: colors.onOverdue },
});
