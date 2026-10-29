import { PillButton } from "@/components/PillButton";
import { useSelectedHousehold } from "@/context/HouseholdContext";
import { fetchMyHouseholds, type MyHousehold } from "@/features/household/api";
import { AVATAR_COLORS, colors, shadow, typography } from "@/theme/colors";
import Feather from "@expo/vector-icons/Feather";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function HouseholdsScreen() {
  const router = useRouter();
  const { setHouseholdId } = useSelectedHousehold();
  const [households, setHouseholds] = useState<MyHousehold[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchMyHouseholds().then(setHouseholds).catch(() => setHouseholds([]));
    }, []),
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Mina hushåll",
          headerRight: () => (
            <Pressable onPress={() => router.push("/profile")} hitSlop={12}>
              <Feather name="user" size={22} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      <Text style={styles.heading}>Välj ett hushåll</Text>

      <FlatList
        data={households}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Du är inte med i något hushåll än</Text>}
        renderItem={({ item, index }) => {
          const color = AVATAR_COLORS[(index * 6) % AVATAR_COLORS.length];
          return (
            <Pressable
              style={styles.card}
              onPress={() => {
                setHouseholdId(item.id);
                router.push("/");
              }}
            >
              <View style={[styles.icon, { backgroundColor: color + "33" }]}>
                <Feather name="home" size={20} color={color} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.memberCount} {item.memberCount === 1 ? "medlem" : "medlemmar"}
                  {item.isOwner ? " · Ägare" : ""}
                </Text>
              </View>
              <Feather name="chevron-right" size={22} color={colors.textMuted} />
            </Pressable>
          );
        }}
      />

      <View style={styles.buttons}>
        <View style={styles.button}>
          <PillButton title="Skapa" icon="plus" variant="primary" onPress={() => router.push("/create-household")} />
        </View>
        <View style={styles.button}>
          <PillButton title="Gå med" icon="home" onPress={() => router.push("/join-household")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  heading: { ...typography.small, color: colors.textMuted, marginBottom: 12 },
  list: { gap: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 10,
    backgroundColor: colors.surface,
    ...shadow,
  },
  icon: { width: 40, height: 40, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  info: { flex: 1, gap: 2 },
  empty: { ...typography.small, color: colors.textMuted },
  name: { fontSize: 18, fontWeight: "500", color: colors.text },
  meta: { ...typography.caption, color: colors.textMuted },
  buttons: { flexDirection: "row", gap: 12, paddingVertical: 12 },
  button: { flex: 1 },
});
