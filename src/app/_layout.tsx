import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors } from "@/theme/colors";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.surface },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
