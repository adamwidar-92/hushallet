import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

export default function HomeScreen() {
  const { session, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Välkommen hem!</Text>
      <Text style={styles.email}>{session?.user.email}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Logga ut</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  email: {
    marginTop: 8,
    color: colors.textMuted,
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: colors.overdue,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  logoutText: {
    color: colors.onOverdue,
    fontSize: 16,
    fontWeight: '600',
  },
});