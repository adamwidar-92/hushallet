import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { ErrorText } from '@/components/ErrorText';
import { PillButton } from '@/components/PillButton';
import { FormScreen } from '@/components/Screen';
import { fetchChore, markChoreDone } from '@/features/chores/api';
import { useHousehold } from '@/features/household/HouseholdProvider';
import { colors, typography } from '@/theme/colors';
import type { Chore } from '@/types/database';

export default function ChoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { current } = useHousehold();
  const [chore, setChore] = useState<Chore | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChore(id)
      .then(setChore)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function markDone() {
    if (!current) return;
    setSaving(true);
    try {
      await markChoreDone(id, current.id);
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kunde inte markera som gjord');
      setSaving(false);
    }
  }

  if (loading) return <ActivityIndicator style={styles.loader} />;
  if (!chore) return <ErrorText message={error ?? 'Sysslan hittades inte.'} />;

  return (
    <FormScreen>
      <Stack.Screen options={{ title: chore.name }} />
      <Card style={styles.card}>
        <Text style={styles.name}>{chore.name}</Text>
        <Text style={styles.description}>{chore.description || 'Ingen beskrivning.'}</Text>
      </Card>
      <Card style={styles.row}>
        <Text style={styles.label}>Återkommer:</Text>
        <View style={styles.inline}>
          <Text style={styles.value}>var</Text>
          <Badge value={chore.frequency_days} highlighted />
          <Text style={styles.value}>dag</Text>
        </View>
      </Card>
      <Card style={styles.row}>
        <Text style={styles.label}>Värde:</Text>
        <Badge value={chore.weight} />
      </Card>
      <ErrorText message={error} />
      {current?.status === 'active' && (
        <PillButton label="Markera som gjord" icon="check-circle" onPress={markDone} loading={saving} />
      )}
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: 48 },
  card: { paddingVertical: 16, gap: 8 },
  name: { ...typography.taskTitle, color: colors.text },
  description: { fontSize: 16, color: colors.text, lineHeight: 22 },
  row: { height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { ...typography.taskTitle, color: colors.text },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  value: { fontSize: 18, color: colors.text },
});
