import Feather from '@expo/vector-icons/Feather';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, shadow, typography } from '@/theme/colors';

type Props = {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

/** Rundad knapp enligt Figma-komponenterna "Button (add)" / "Button (change)". */
export function PillButton({ label, icon, onPress, disabled, loading }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [styles.button, (pressed || disabled) && styles.dimmed]}>
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        icon && <Feather name={icon} size={24} color={colors.text} />
      )}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    ...shadow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 100,
    backgroundColor: colors.surface,
  },
  dimmed: { opacity: 0.6 },
  label: { ...typography.taskTitle, color: colors.text },
});
