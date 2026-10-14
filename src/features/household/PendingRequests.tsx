import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { PillButton } from '@/components/PillButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuth } from '@/features/auth/AuthProvider';
import { colors, typography } from '@/theme/colors';

import { cancelRequest } from './api';
import { useHousehold } from './HouseholdProvider';

/** Visas när användaren har skickat en förfrågan som väntar på godkännande. */
export function PendingRequests() {
  const { pending, refresh } = useHousehold();
  const { signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    try {
      await fn();
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Hushållet" subtitle="Väntar på godkännande" />
      <View style={styles.content}>
        {pending.map((p) => (
          <Card key={p.id} style={styles.card}>
            <Text style={styles.emoji}>{p.avatar}</Text>
            <Text style={styles.text}>
              Din förfrågan har skickats. En ägare av hushållet behöver godkänna dig innan du kommer in.
            </Text>
            <PillButton label="Avbryt förfrågan" icon="x-circle" onPress={() => run(() => cancelRequest(p.id))} disabled={busy} />
          </Card>
        ))}
        <PillButton label="Uppdatera" icon="refresh-cw" onPress={() => run(async () => {})} loading={busy} />
        <PillButton label="Logga ut" icon="log-out" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: 12, gap: 12 },
  card: { paddingVertical: 18, gap: 12, alignItems: 'center' },
  emoji: { fontSize: 48 },
  text: { ...typography.small, color: colors.text, textAlign: 'center' },
});
