import { AvatarPicker } from "@/components/AvatarPicker";
import { PillButton } from "@/components/PillButton";
import { TextField } from "@/components/TextField";
import { useSelectedHousehold } from "@/context/HouseholdContext";
import { createHousehold } from "@/features/household/api";
import { AVATAR_COLORS, colors, shadow, typography } from "@/theme/colors";
import type { Avatar, Household } from "@/types/database";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function CreateHouseholdScreen() {
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState<Avatar | null>(null);
    const [color, setColor] = useState<string>(AVATAR_COLORS[0]);
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState<Household | null>(null);
    const { setHouseholdId } = useSelectedHousehold();

    const create = async () => {
        if (!avatar) {
            setError("Välj en avatar");
            return;
        }
        setLoading(true);
        setError(undefined);
        try {
            setCreated(await createHousehold(name, avatar, color));
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (created) {
        return (
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.label}>Kod för att gå med</Text>
                    <Text style={styles.code}>{created.join_code}</Text>
                    <Text style={styles.hint}>Dela koden med de du bor med.</Text>
                </View>
                <PillButton title="Kopiera kod" icon="copy" onPress={() => Clipboard.setStringAsync(created.join_code)} />
                <PillButton title="Gå till hushållet" icon="home" variant="primary" onPress={() => {
                    setHouseholdId(created.id);
                    router.replace("/");
                }} />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextField label="Hushållets namn" value={name} onChangeText={setName} placeholder="Familjen Andersson" />
            <AvatarPicker
                selectedAvatar={avatar}
                selectedColor={color}
                onSelectAvatar={setAvatar}
                onSelectColor={setColor}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <PillButton title="Skapa hushåll" icon="check" variant="primary" onPress={create} disabled={loading} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 12, gap: 12, backgroundColor: colors.background },
    card: { padding: 18, borderRadius: 10, backgroundColor: colors.surface, ...shadow },
    label: { ...typography.small, color: colors.textMuted },
    code: { fontSize: 32, fontWeight: "700", letterSpacing: 4, color: colors.text },
    hint: { ...typography.small, color: colors.textMuted },
    error: { ...typography.small, color: colors.danger },
});