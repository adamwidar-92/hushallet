import { PillButton } from "@/components/PillButton";
import { TextField } from "@/components/TextField";
import { useAuth } from "@/context/AuthContext";
import { useChores } from "@/features/chores/useChores";
import { fetchProfileNames } from "@/features/household/api";
import { useHousehold } from "@/features/household/useHousehold";
import { colors, shadow, typography } from "@/theme/colors";
import Feather from "@expo/vector-icons/Feather";
import * as Clipboard from "expo-clipboard";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HouseholdScreen() {
  const { household, isOwner, rename } = useHousehold();
  const { members } = useChores();
  const { session, signOut } = useAuth();
  const [names, setNames] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | undefined>();

  const userIds = members.map((m) => m.user_id).join(",");
  useEffect(() => {
    fetchProfileNames(userIds ? userIds.split(",") : []).then(setNames);
  }, [userIds]);

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

  const visibleMembers = members.filter((m) => m.status !== "pending");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: "Hushållet" }} />

      {editing ? (
        <View style={styles.editCard}>
          <TextField
            label="Namn"
            value={draft}
            onChangeText={setDraft}
            error={error}
            autoFocus
          />
          <PillButton title="Spara" icon="check" variant="primary" onPress={save} />
          <PillButton title="Avbryt" icon="x" onPress={() => setEditing(false)} />
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.label}>Namn</Text>
              <Text style={styles.value}>{household.name}</Text>
            </View>
            {isOwner && (
              <Pressable onPress={startEdit} hitSlop={12}>
                <Feather name="edit-2" size={20} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.label}>Kod</Text>
              <Text style={styles.code}>{household.join_code}</Text>
            </View>
            <Pressable onPress={copyCode} hitSlop={12}>
              <Feather name="copy" size={20} color={colors.textMuted} />
            </Pressable>
          </View>
        </View>
      )}

      <Text style={styles.section}>Medlemmar</Text>
      <View style={styles.card}>
        {visibleMembers.map((m) => (
          <View key={m.id} style={styles.member}>
            <View style={[styles.avatar, { borderColor: m.avatar_color, backgroundColor: m.avatar_color + "33" }]}>
              <Text style={styles.emoji}>{m.avatar}</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.memberName}>{names[m.user_id] || "Namnlös"}</Text>
              <Text style={styles.label}>
                {m.is_owner ? "Ägare" : "Medlem"}
                {m.user_id === session?.user.id ? " · du" : ""}
              </Text>
            </View>
            {m.status === "paused" && <Text style={styles.paused}>Pausad</Text>}
          </View>
        ))}
      </View>

      <PillButton
        title="Mina hushåll"
        icon="home"
        onPress={() => router.dismissTo("/households")}
      />
      <Pressable onPress={signOut} style={styles.logout}>
        <Feather name="log-out" size={20} color={colors.danger} />
        <Text style={styles.logoutText}>Logga ut</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    gap: 12,
    backgroundColor: colors.background,
  },
  card: {
    padding: 16,
    gap: 12,
    borderRadius: 10,
    backgroundColor: colors.surface,
    ...shadow,
  },
  editCard: { gap: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  flex: { flex: 1 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  label: { ...typography.caption, color: colors.textMuted },
  value: { fontSize: 18, fontWeight: "700", color: colors.text },
  code: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 4,
    color: colors.text,
  },
  section: { ...typography.small, color: colors.textMuted },
  member: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 20 },
  memberName: { fontSize: 18, color: colors.text },
  paused: {
    ...typography.caption,
    fontWeight: "700",
    color: colors.text,
    backgroundColor: colors.badge,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
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
