import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorText } from '@/components/ErrorText';
import { PillButton } from '@/components/PillButton';
import { TextField } from '@/components/TextField';
import { colors, typography } from '@/theme/colors';

type Props = {
  mode: 'login' | 'register';
  onSubmit: (values: { email: string; password: string; name: string }) => Promise<string | null>;
};

export function AuthForm({ mode, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  async function submit() {
    if (!email || password.length < 6 || (isRegister && !name.trim())) {
      setMessage('Fyll i alla fält (lösenord minst 6 tecken).');
      return;
    }
    setLoading(true);
    setMessage(await onSubmit({ email, password, name }));
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.logo}>🏠</Text>
        <Text style={styles.title}>Hushållet</Text>
        <Text style={styles.subtitle}>{isRegister ? 'Skapa konto' : 'Logga in'}</Text>
        {isRegister && <TextField placeholder="Namn" value={name} onChangeText={setName} autoComplete="name" />}
        <TextField
          placeholder="E-post"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextField placeholder="Lösenord" value={password} onChangeText={setPassword} secureTextEntry />
        <ErrorText message={message} />
        <PillButton
          label={isRegister ? 'Registrera' : 'Logga in'}
          icon={isRegister ? 'user-plus' : 'log-in'}
          onPress={submit}
          loading={loading}
        />
        <Link href={isRegister ? '/login' : '/register'} style={styles.link}>
          {isRegister ? 'Har du redan ett konto? Logga in' : 'Inget konto? Registrera dig'}
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  logo: { fontSize: 56, textAlign: 'center' },
  title: { ...typography.title, fontSize: 32, color: colors.text, textAlign: 'center' },
  subtitle: { ...typography.subtitle, color: colors.textMuted, textAlign: 'center', marginBottom: 12 },
  link: { color: colors.text, textAlign: 'center', marginTop: 8, textDecorationLine: 'underline' },
});
