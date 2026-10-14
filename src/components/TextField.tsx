import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { colors, shadow } from '@/theme/colors';

export function TextField({ style, multiline, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.placeholder}
      multiline={multiline}
      style={[styles.input, multiline && styles.multiline, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    ...shadow,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 18,
    height: 55,
    fontSize: 18,
    color: colors.text,
  },
  multiline: { height: 128, paddingTop: 16, textAlignVertical: 'top' },
});
