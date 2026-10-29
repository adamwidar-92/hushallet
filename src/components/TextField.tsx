import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { colors, shadow, typography } from "@/theme/colors";

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function TextField({ label, error, multiline, style, ...rest }: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.placeholder}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline, style]}
        {...rest}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { ...typography.small, color: colors.textMuted },
  input: {
    height: 55,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: colors.surface,
    fontSize: 18,
    color: colors.text,
    ...shadow,
  },
  multiline: { height: 128, paddingTop: 16, textAlignVertical: "top" },
  error: { ...typography.small, color: colors.danger },
});
