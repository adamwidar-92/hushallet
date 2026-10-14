import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme/colors';

/** Platshållare. Appen byggs upp via GitHub-issues – se README. */
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hushållet</Text>
      <Text style={styles.text}>
        Här börjar appen. Välj en issue på GitHub (adamwidar-92/hushallet/issues) och bygg vidare enligt docs/DESIGN.md.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { ...typography.title, fontSize: 32, color: colors.text },
  text: { ...typography.small, color: colors.textMuted, textAlign: 'center' },
});
