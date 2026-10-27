import { PillButton } from "@/components/PillButton";
import { TextField } from "@/components/TextField";
import { useHousehold } from "@/features/household/useHousehold";
import { colors, shadow, typography } from "@/theme/colors";
import * as Clipboard from "expo-clipboard";
import { Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HouseholdScreen() {
    const { household, isOwner, rename } = useHousehold();
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
                    <TextField value={draft} onChangeText={setDraft} error={error} autoFocus />
                    <PillButton title="Spara" icon="check" onPress={save} />
                    <PillButton title="Avbryt" icon="x" onPress={() => setEditing(false)} />
                </>
            ) : (
                isOwner && <PillButton title="Ändra namn" icon="edit-2" onPress={startEdit} />
            )}

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