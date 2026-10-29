import { AvatarPicker } from "@/components/AvatarPicker";
import { PillButton } from "@/components/PillButton";
import { TextField } from "@/components/TextField";
import { useSelectedHousehold } from "@/context/HouseholdContext";
import { fetchTakenAvatars, requestJoin } from "@/features/household/api";
import { AVATAR_COLORS, colors, typography } from "@/theme/colors";
import type { Avatar, HouseholdMember } from "@/types/database";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function JoinHouseholdScreen() {
    const [code, setCode] = useState("");
    const [avatar, setAvatar] = useState<Avatar | null>(null);
    const [color, setColor] = useState<string>(AVATAR_COLORS[0]);
    const [taken, setTaken] = useState<Avatar[]>([]);
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState<HouseholdMember | null>(null);
    const { setHouseholdId } = useSelectedHousehold();

    const onChangeCode = (text: string) => {
        setCode(text);
        if (text.trim().length === 6) {
            fetchTakenAvatars(text).then(setTaken);
        } else {
            setTaken([]);
        }
    };

    const join = async () => {
        if (!avatar) {
            setError("Välj en avatar");
            return;
        }
        setLoading(true);
        setError(undefined);
        try {
            setRequest(await requestJoin(code, avatar, color));
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const goToHousehold = () => {
        if (!request) return;
        setHouseholdId(request.household_id);
        router.replace("/");
    };

    if (request) {
        return (
            <View style={styles.center}>
                <View style={[styles.avatarCircle, { backgroundColor: request.avatar_color }]}>
                    <Text style={styles.avatar}>{request.avatar}</Text>
                </View>
                <Text style={styles.title}>Du är med i hushållet!</Text>
                <PillButton title="Gå till hushållet" icon="home" variant="primary" onPress={goToHousehold} />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextField
                label="Hushållets kod"
                value={code}
                onChangeText={onChangeCode}
                placeholder="K7M2QX"
                autoCapitalize="characters"
                maxLength={6}
            />
            <AvatarPicker
                selectedAvatar={avatar}
                selectedColor={color}
                onSelectAvatar={setAvatar}
                onSelectColor={setColor}
                takenAvatars={taken}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <PillButton title="Gå med" icon="log-in" variant="primary" onPress={join} disabled={loading} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 12, gap: 12, backgroundColor: colors.background },
    center: { flex: 1, padding: 24, gap: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
    avatarCircle: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },
    avatar: { fontSize: 48 },
    title: { ...typography.title, color: colors.text },
    hint: { ...typography.small, color: colors.textMuted, textAlign: "center" },
    error: { ...typography.small, color: colors.danger },
});