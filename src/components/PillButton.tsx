import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors, shadow, typography } from "@/theme/colors";

type Props = {
  title: string;
  icon?: keyof typeof Feather.glyphMap;
  onPress: () => void;
  variant?: "default" | "primary" | "danger";
  disabled?: boolean;
};

export function PillButton({
  title,
  icon,
  onPress,
  variant = "default",
  disabled,
}: Props) {
  const textColor =
    variant === "primary"
      ? colors.onPrimary
      : variant === "danger"
        ? colors.danger
        : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && styles.primary,
        (pressed || disabled) && styles.dimmed,
      ]}
    >
      {icon && <Feather name={icon} size={24} color={textColor} />}
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 16,
    borderRadius: 100,
    backgroundColor: colors.surface,
    ...shadow,
  },
  primary: { backgroundColor: colors.primary },
  dimmed: { opacity: 0.5 },
  title: typography.taskTitle,
});
