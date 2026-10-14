import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ErrorText } from '@/components/ErrorText';
import { PillButton } from '@/components/PillButton';
import { FormScreen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { createChore } from '@/features/chores/api';
import { FrequencyPicker } from '@/features/chores/FrequencyPicker';
import { WeightPicker } from '@/features/chores/WeightPicker';
import { useHousehold } from '@/features/household/HouseholdProvider';
import type { ChoreWeight } from '@/types/database';

/** "Sysslor - lägg till" i Figma. Endast ägare når hit via Dagsvyn. */
export default function NewChoreScreen() {
  const { current } = useHousehold();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState(7);
  const [weight, setWeight] = useState<ChoreWeight>(2);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!current) return;
    if (!name.trim()) return setError('Ange en titel.');
    setSaving(true);
    try {
      await createChore(current.household_id, {
        name: name.trim(),
        description: description.trim(),
        frequency_days: frequency,
        weight,
      });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kunde inte spara');
      setSaving(false);
    }
  }

  return (
    <FormScreen>
      <TextField placeholder="Titel" value={name} onChangeText={setName} />
      <TextField placeholder="Beskrivning" value={description} onChangeText={setDescription} multiline />
      <FrequencyPicker value={frequency} onChange={setFrequency} />
      <WeightPicker value={weight} onChange={setWeight} />
      <ErrorText message={error} />
      <View style={styles.actions}>
        <PillButton label="Spara" icon="plus-circle" onPress={save} loading={saving} />
        <PillButton label="Stäng" icon="x-circle" onPress={() => router.back()} />
      </View>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
});
