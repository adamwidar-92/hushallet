import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ErrorText } from '@/components/ErrorText';
import { PillButton } from '@/components/PillButton';
import { FormScreen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { TextField } from '@/components/TextField';
import { useAuth } from '@/features/auth/AuthProvider';
import { AVATAR_COLORS, colors, typography } from '@/theme/colors';
import type { AvatarEmoji } from '@/types/database';

import { createHousehold, fetchTakenAvatars, friendlyError, requestJoin } from './api';
import { AvatarPicker } from './AvatarPicker';
import { useHousehold } from './HouseholdProvider';

type Mode = 'create' | 'join';

export function SetupHousehold() {
  const { signOut } = useAuth();
  const { refresh } = useHousehold();
  const [mode, setMode] = useState<Mode>('create');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [avatar, setAvatar] = useState<AvatarEmoji | null>(null);
  const [color, setColor] = useState<string>(AVATAR_COLORS[0]);
  const [taken, setTaken] = useState<AvatarEmoji[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Hämta upptagna avatarer när en fullständig kod har angetts.
  const normalizedCode = mode === 'join' && code.trim().length === 6 ? code.trim().toUpperCase() : null;
  useEffect(() => {
    let active = true;
    const load = normalizedCode ? fetchTakenAvatars(normalizedCode) : Promise.resolve<AvatarEmoji[]>([]);
    load
      .then((list) => {
        if (!active) return;
        setTaken(list);
        setAvatar((a) => (a && list.includes(a) ? null : a));
      })
      .catch(() => active && setTaken([]));
    return () => {
      active = false;
    };
  }, [normalizedCode]);

  async function submit() {
    setError(null);
    if (!avatar) return setError('Välj en avatar.');
    if (mode === 'create' && !name.trim()) return setError('Ange ett namn på hushållet.');
    if (mode === 'join' && !normalizedCode) return setError('Ange en kod med 6 tecken.');
    setLoading(true);
    try {
      if (mode === 'create') await createHousehold(name, avatar, color);
      else await requestJoin(normalizedCode!, avatar, color);
      await refresh();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Hushållet" subtitle="Kom igång" />
      <FormScreen>
        <View style={styles.tabs}>
          {(['create', 'join'] as const).map((m) => (
            <Pressable key={m} onPress={() => setMode(m)} style={[styles.tab, mode === m && styles.tabActive]}>
              <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
                {m === 'create' ? 'Skapa hushåll' : 'Gå med'}
              </Text>
            </Pressable>
          ))}
        </View>
        {mode === 'create' ? (
          <TextField placeholder="Hushållets namn" value={name} onChangeText={setName} />
        ) : (
          <TextField
            placeholder="Kod (6 tecken)"
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase())}
            autoCapitalize="characters"
            maxLength={6}
          />
        )}
        <AvatarPicker avatar={avatar} color={color} taken={taken} onChangeAvatar={setAvatar} onChangeColor={setColor} />
        <ErrorText message={error} />
        <PillButton
          label={mode === 'create' ? 'Skapa' : 'Skicka förfrågan'}
          icon={mode === 'create' ? 'plus-circle' : 'send'}
          onPress={submit}
          loading={loading}
        />
        <Pressable onPress={signOut}>
          <Text style={styles.signOut}>Logga ut</Text>
        </Pressable>
      </FormScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  tabs: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 100, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 100, alignItems: 'center' },
  tabActive: { backgroundColor: colors.text },
  tabText: { ...typography.subtitle, color: colors.text },
  tabTextActive: { color: colors.surface },
  signOut: { color: colors.textMuted, textAlign: 'center', marginTop: 12, textDecorationLine: 'underline' },
});
