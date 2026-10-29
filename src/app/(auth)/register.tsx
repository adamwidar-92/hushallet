import { PillButton } from "@/components/PillButton";
import { TextField } from "@/components/TextField";
import { useAuth } from "@/context/AuthContext";
import { colors, typography } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
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
    else if (password.length < 8)
      next.password = "Lösenordet är för kort (minst 8 tecken).";
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
        <TextField
          label="Namn"
          placeholder="Anna Andersson"
          value={name}
          onChangeText={setName}
          autoComplete="name"
          error={errors.name}
        />
        <TextField
          label="E-post"
          placeholder="namn@exempel.se"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          error={errors.email}
        />
        <TextField
          label="Lösenord"
          placeholder="Lösenord"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          error={errors.password}
        />
        <TextField
          label="Bekräfta lösenord"
          placeholder="Bekräfta lösenord"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          error={errors.confirm ?? errors.general}
        />
        <Text style={styles.hint}>Minst 8 tecken.</Text>
      </ScrollView>
      <View style={styles.footer}>
        <PillButton
          title="Skapa konto"
          variant="primary"
          onPress={handleRegister}
          disabled={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    padding: 12,
    gap: 12,
  },
  hint: { ...typography.caption, color: colors.textMuted },
  footer: { padding: 12 },
});
