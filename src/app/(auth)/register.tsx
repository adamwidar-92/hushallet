import { PillButton } from "@/components/PillButton";
import { TextField } from "@/components/TextField";
import { useAuth } from "@/context/AuthContext";
import { colors, typography } from "@/theme/colors";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  general?: string;
};

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    const next: Errors = {};
    if (!name.trim()) next.name = "Fyll i ditt namn.";
    if (!email.trim()) next.email = "Fyll i din e-post.";
    if (!password) next.password = "Fyll i ett lösenord.";
    else if (password.length < 6)
      next.password = "Lösenordet är för kort (minst 6 tecken).";
    if (password && password !== confirmPassword)
      next.confirm = "Lösenorden matchar inte.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    const { error, needsConfirmation } = await signUp(
      email.trim(),
      password,
      name.trim()
    );
    setLoading(false);

    if (error) {
      if (error.includes("E-postadressen")) setErrors({ email: error });
      else if (error.includes("Lösenordet")) setErrors({ password: error });
      else setErrors({ general: error });
    } else if (needsConfirmation) {
      Alert.alert("Konto skapat!", "Bekräfta din e-post och logga sedan in.");
      router.replace("/(auth)/login");
    }
    // Annars finns en session direkt och Stack.Protected skickar användaren vidare
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
        <Text style={styles.subtitle}>Skapa konto</Text>

        <TextField
          placeholder="Namn"
          value={name}
          onChangeText={setName}
          autoComplete="name"
          error={errors.name}
        />
        <TextField
          placeholder="E-post"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          error={errors.email}
        />
        <TextField
          placeholder="Lösenord"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          error={errors.password}
        />
        <TextField
          placeholder="Bekräfta lösenord"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          error={errors.confirm ?? errors.general}
        />

        <PillButton
          title="Registrera"
          icon="user-plus"
          onPress={handleRegister}
          disabled={loading}
        />

        <Pressable style={styles.link} onPress={() => router.back()}>
          <Text style={styles.linkText}>Har du redan ett konto? Logga in</Text>
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
