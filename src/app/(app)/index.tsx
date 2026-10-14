import { router } from 'expo-router';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorText } from '@/components/ErrorText';
import { PillButton } from '@/components/PillButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuth } from '@/features/auth/AuthProvider';
import { ChoreCard } from '@/features/chores/ChoreCard';
import { useChoreOverview } from '@/features/chores/useChoreOverview';
import { useHousehold } from '@/features/household/HouseholdProvider';
import { colors } from '@/theme/colors';

/** Dagsvyn ("Sysslor - idag" i Figma). */
export default function DailyViewScreen() {
  const { current } = useHousehold();
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const { statuses, loading, error, reload } = useChoreOverview(current?.household_id);
  const isOwner = !!current?.is_owner;

  return (
    <View style={styles.container}>
      <ScreenHeader title={current?.household?.name ?? 'Hushållet'} subtitle="idag" />
      <FlatList
        data={statuses}
        keyExtractor={(s) => s.chore.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
        renderItem={({ item }) => (
          <ChoreCard status={item} onPress={() => router.push({ pathname: '/chore/[id]', params: { id: item.chore.id } })} />
        )}
        ListHeaderComponent={<ErrorText message={error} />}
        ListEmptyComponent={
          loading ? null : (
            <Text style={styles.empty}>
              {isOwner ? 'Inga sysslor än. Tryck på "Lägg till" för att skapa en.' : 'Inga sysslor än.'}
            </Text>
          )
        }
        ListFooterComponent={
          <View style={styles.footerInfo}>
            {current?.household?.join_code ? (
              <Text style={styles.muted}>Kod för att gå med: {current.household.join_code}</Text>
            ) : null}
            <Pressable onPress={signOut}>
              <Text style={styles.link}>Logga ut</Text>
            </Pressable>
          </View>
        }
      />
      {isOwner && (
        <View style={[styles.actions, { paddingBottom: 12 + insets.bottom }]}>
          <PillButton label="Lägg till" icon="plus-circle" onPress={() => router.push('/chore/new')} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 12, gap: 12 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 32, fontSize: 16 },
  footerInfo: { alignItems: 'center', gap: 8, marginTop: 16 },
  muted: { color: colors.textMuted },
  link: { color: colors.textMuted, textDecorationLine: 'underline' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 12 },
});
