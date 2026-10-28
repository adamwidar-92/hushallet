import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { FrequencyPicker, WeightPicker } from "@/components/ChorePickers";
import { TextField } from "@/components/TextField";
import { colors, typography } from "@/theme/colors";
import type { Chore } from "@/types/database";

export type ChoreInput = Pick<
  Chore,
  "name" | "description" | "frequency_days" | "weight"
>;

const emptyChore: ChoreInput = {
  name: "",
  description: "",
  frequency_days: 7,
  weight: 1,
};

export function validateChore({ name, frequency_days }: ChoreInput) {
  if (!name.trim()) return "Titel krävs";
  if (frequency_days < 1) return "Återkommer måste vara minst 1 dag";
  return null;
}

type Props = {
  heading: string;
  initial?: ChoreInput;
  error?: string;
  onSave: (input: ChoreInput) => void;
  onClose: () => void;
};

export function ChoreForm({
  heading,
  initial = emptyChore,
  error,
  onSave,
  onClose,
}: Props) {
  const [input, setInput] = useState(initial);
  const [validationError, setValidationError] = useState<string | null>(null);
  const set = (change: Partial<ChoreInput>) =>
    setInput({ ...input, ...change });
  const message = validationError ?? error;

  const save = () => {
    const invalid = validateChore(input);
    setValidationError(invalid);
    if (!invalid) onSave({ ...input, name: input.name.trim() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      <ScrollView contentContainerStyle={styles.body}>
        <TextField
          placeholder="Titel"
          value={input.name}
          onChangeText={(name) => set({ name })}
        />
        <TextField
          placeholder="Beskrivning"
          value={input.description}
          onChangeText={(description) => set({ description })}
          multiline
        />
        <FrequencyPicker
          value={input.frequency_days}
          onChange={(frequency_days) => set({ frequency_days })}
        />
        <WeightPicker
          value={input.weight}
          onChange={(weight) => set({ weight })}
        />
        {message && <Text style={styles.error}>{message}</Text>}
      </ScrollView>
      <View style={styles.footer}>
        <FooterButton title="Spara" icon="plus-circle" onPress={save} />
        <View style={styles.divider} />
        <FooterButton title="Stäng" icon="x-circle" onPress={onClose} />
      </View>
    </View>
  );
}

type FooterButtonProps = {
  title: string;
  icon: "plus-circle" | "x-circle";
  onPress: () => void;
};

function FooterButton({ title, icon, onPress }: FooterButtonProps) {
  return (
    <Pressable style={styles.footerButton} onPress={onPress}>
      <Feather name={icon} size={24} color={colors.text} />
      <Text style={styles.footerText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heading: {
    ...typography.title,
    color: colors.text,
    padding: 16,
    backgroundColor: colors.surface,
  },
  body: { padding: 12, gap: 12 },
  error: { ...typography.small, color: colors.danger, textAlign: "center" },
  footer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  divider: { width: 1, backgroundColor: colors.border },
  footerButton: {
    flex: 1,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  footerText: { ...typography.taskTitle, color: colors.text },
});
