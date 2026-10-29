import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { HouseholdProvider } from "@/context/HouseholdContext";
import { colors } from "@/theme/colors";

function RootNavigator() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.surface },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="households" />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="household" />
        <Stack.Screen
          name="create-household"
          options={{ title: "Skapa hushåll" }}
        />
        <Stack.Screen
          name="join-household"
          options={{ title: "Gå med i hushåll" }}
        />
        <Stack.Screen name="statistics" />
        <Stack.Screen name="chore/[id]" />
        <Stack.Screen
          name="chore-form"
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HouseholdProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </HouseholdProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
