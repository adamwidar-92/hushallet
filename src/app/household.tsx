import { PillButton } from "@/components/PillButton";
import { useHousehold } from "@/features/household/useHousehold";
import { colors, shadow, typography } from "@/theme/colors";
import * as Clipboard from "expo-clipboard";
import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function HouseholdScreen() {
    const { household } = useHousehold();

    if (!household) return null;
    const copyCode = async () => {
        await Clipboard.setStringAsync(household.join_code);
    };
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: household.name }} />

            <View style={styles.card}>
                <Text style={styles.label}>Kod för att gå med</Text>
                <Text style={styles.code}>{household.join_code}</Text>
            </View>
            <PillButton title="Kopiera kod" icon="copy" onPress={copyCode} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12, gap: 12, backgroundColor: colors.background },
    card: { padding: 18, borderRadius: 10, backgroundColor: colors.surface, ...shadow },
    label: { ...typography.small, color: colors.textMuted },
    code: { fontSize: 32, fontWeight: "700", letterSpacing: 4, color: colors.text },
});