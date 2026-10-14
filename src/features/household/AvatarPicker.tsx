import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AVATAR_COLORS, colors, typography } from '@/theme/colors';
import { AVATARS, type AvatarEmoji } from '@/types/database';

type Props = {
  avatar: AvatarEmoji | null;
  color: string;
  taken?: AvatarEmoji[];
  onChangeAvatar: (a: AvatarEmoji) => void;
  onChangeColor: (c: string) => void;
};

/** Välj emoji-djur + färg. Upptagna avatarer i hushållet döljs. */
export function AvatarPicker({ avatar, color, taken = [], onChangeAvatar, onChangeColor }: Props) {
  const available = AVATARS.filter((a) => !taken.includes(a));
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Välj avatar</Text>
      <View style={styles.row}>
        {available.map((a) => (
          <Pressable
            key={a}
            accessibilityLabel={`Avatar ${a}`}
            onPress={() => onChangeAvatar(a)}
            style={[styles.avatar, { backgroundColor: a === avatar ? color : colors.badge }]}>
            <Text style={styles.emoji}>{a}</Text>
          </Pressable>
        ))}
        {available.length === 0 && <Text style={styles.muted}>Alla avatarer är tyvärr upptagna.</Text>}
      </View>
      <Text style={styles.label}>Välj färg</Text>
      <View style={styles.row}>
        {AVATAR_COLORS.map((c) => (
          <Pressable
            key={c}
            accessibilityLabel={`Färg ${c}`}
            onPress={() => onChangeColor(c)}
            style={[styles.color, { backgroundColor: c }, c === color && styles.selectedColor]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: { ...typography.subtitle, color: colors.text },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 26 },
  color: { width: 32, height: 32, borderRadius: 16 },
  selectedColor: { borderWidth: 3, borderColor: colors.text },
  muted: { color: colors.textMuted },
});
