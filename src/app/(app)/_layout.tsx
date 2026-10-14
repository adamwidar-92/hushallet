import { Stack } from 'expo-router';

import { colors } from '@/theme/colors';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.surface },
        contentStyle: { backgroundColor: colors.background },
        headerBackTitle: 'Tillbaka',
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="chore/[id]" options={{ title: 'Syssla' }} />
      <Stack.Screen name="chore/new" options={{ title: 'Skapa en ny syssla', presentation: 'modal' }} />
    </Stack>
  );
}
