import { PillButton } from "@/components/PillButton";
import { TextField } from "@/components/TextField";
import { useAuth } from "@/context/AuthContext";
import { useHousehold } from "@/features/household/useHousehold";
import { colors, shadow, typography } from "@/theme/colors";
import Feather from "@expo/vector-icons/Feather";
import * as Clipboard from "expo-clipboard";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HouseholdScreen() {
  const { household, isOwner, rename } = useHousehold();
  const { signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | undefined>();

  if (!household) return null;
  const copyCode = async () => {
    await Clipboard.setStringAsync(household.join_code);
  };
  const startEdit = () => {
    setDraft(household.name);
    setError(undefined);
    setEditing(true);
  };

  const save = async () => {
    try {
      await rename(draft);
      setEditing(false);
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: household.name }} />
      {editing ? (
        <>
          <TextField
            value={draft}
            onChangeText={setDraft}
            error={error}
            autoFocus
          />
          <PillButton title="Spara" icon="check" onPress={save} />
          <PillButton
            title="Avbryt"
            icon="x"
            onPress={() => setEditing(false)}
          />
        </>
      ) : (
        isOwner && (
          <PillButton title="Ändra namn" icon="edit-2" onPress={startEdit} />
        )
      )}

      <View style={styles.card}>
        <Text style={styles.label}>Kod för att gå med</Text>
        <Text style={styles.code}>{household.join_code}</Text>
      </View>
      <PillButton title="Kopiera kod" icon="copy" onPress={copyCode} />
      <PillButton
        title="Mina hushåll"
        icon="home"
        onPress={() => router.dismissTo("/households")}
      />
      <Pressable onPress={signOut} style={styles.logout}>
        <Feather name="log-out" size={20} color={colors.danger} />
        <Text style={styles.logoutText}>Logga ut</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    gap: 12,
    backgroundColor: colors.background,
  },
  card: {
    padding: 18,
    borderRadius: 10,
    backgroundColor: colors.surface,
    ...shadow,
  },
  label: { ...typography.small, color: colors.textMuted },
  code: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 4,
    color: colors.text,
  },
  logout: {
    marginTop: "auto",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
  },
  logoutText: { fontSize: 16, fontWeight: "500", color: colors.danger },
});
