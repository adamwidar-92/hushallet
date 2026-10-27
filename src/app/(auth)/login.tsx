import { PillButton } from "@/components/PillButton";
import { TextField } from "@/components/TextField";
import { useAuth } from "@/context/AuthContext";
import { colors, typography } from "@/theme/colors";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Fyll i både e-post och lösenord.");
      return;
    }
    setError(undefined);
    setLoading(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setLoading(false);
    if (signInError) {
      setError(signInError);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.title}>Hushållet</Text>
        <Text style={styles.subtitle}>Logga in</Text>

        <TextField
          placeholder="E-post"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
        />
        <TextField
          placeholder="Lösenord"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          error={error}
        />

        <PillButton
          title="Logga in"
          icon="log-in"
          onPress={handleLogin}
          disabled={loading}
        />

        <Pressable
          style={styles.link}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.linkText}>Har du inget konto? Registrera dig</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 12,
    gap: 12,
  },
  logo: { width: 96, height: 96, alignSelf: "center", borderRadius: 20 },
  title: { ...typography.huge, color: colors.text, textAlign: "center" },
  subtitle: {
    ...typography.subtitle,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 12,
  },
  link: { alignItems: "center", paddingVertical: 12 },
  linkText: { ...typography.small, color: colors.text, textDecorationLine: "underline" },
});
