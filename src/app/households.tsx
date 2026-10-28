import { PillButton } from "@/components/PillButton";
import { mockHousehold } from "@/mock/mockData";
import { colors, shadow, typography } from "@/theme/colors";
import { Stack, useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function HouseholdsScreen() {
  const router = useRouter();
  const households = [mockHousehold];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Mina hushåll" }} />
      <Text style={styles.heading}>Välj ett hushåll</Text>

      <FlatList
        data={households}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push("/")}>
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
      />

      <View style={styles.buttons}>
        <PillButton title="Skapa" icon="plus-circle" onPress={() => {}} />
        <PillButton title="Gå med" icon="log-in" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: colors.background },
  heading: { ...typography.subtitle, color: colors.text, marginBottom: 12 },
  list: { gap: 12 },
  card: { padding: 18, borderRadius: 10, backgroundColor: colors.surface, ...shadow },
  name: { ...typography.taskTitle, color: colors.text },
  buttons: { flexDirection: "row", gap: 12, justifyContent: "center", paddingVertical: 12 },
});
