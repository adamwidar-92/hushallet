import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, shadow, typography } from "@/theme/colors";
import { supabase } from "@/lib/supabase";

interface ProfileScreenProps {
  userId?: string;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ userId }) => {
  const [name, setName] = useState("");
  const [initialName, setInitialName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);

        let targetId = userId;
        if (!targetId) {
          const { data: authData } = await supabase.auth.getUser();
          targetId = authData?.user?.id;
        }

        if (!targetId) {
          if (isMounted) setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", targetId)
          .single();

        if (error) throw error;

        if (data?.name && isMounted) {
          setName(data.name);
          setInitialName(data.name);
        }
      } catch {
        // Fallback vid fel eller om användaren saknar sparad profil
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleSave = async () => {
    setSuccessMessage(false);
    setErrorMessage(null);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage("Namnet får inte vara tomt.");
      return;
    }

    try {
      setSaving(true);

      let targetId = userId;
      if (!targetId) {
        const { data: authData } = await supabase.auth.getUser();
        targetId = authData?.user?.id;
      }

      if (targetId) {
        const { error } = await supabase
          .from("profiles")
          .update({ name: trimmedName })
          .eq("id", targetId);

        if (error) throw error;
      }

      setInitialName(trimmedName);
      setSuccessMessage(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Kunde inte uppdatera namnet.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  const isSaveDisabled =
    name.trim().length === 0 || name.trim() === initialName || saving;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Namn</Text>
      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(val) => {
            setName(val);
            setSuccessMessage(false);
            setErrorMessage(null);
          }}
          placeholder="Ditt namn"
          placeholderTextColor={colors.placeholder}
          autoCapitalize="words"
        />
      </View>

      {successMessage && (
        <Text style={styles.successText}>Ditt namn har sparats!</Text>
      )}

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity
        style={[styles.saveButton, isSaveDisabled && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaveDisabled}
        activeOpacity={0.8}
      >
        <Feather
          name="check"
          size={20}
          color={colors.text}
          style={styles.buttonIcon}
        />
        <Text style={styles.saveButtonText}>
          {saving ? "Sparar..." : "Spara ändringar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputCard: {
    height: 55,
    backgroundColor: colors.surface,
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    ...shadow,
  },
  input: {
    fontSize: 18,
    color: colors.text,
  },
  successText: {
    ...typography.caption,
    color: "#2A9D8F",
    marginBottom: 12,
    marginLeft: 4,
  },
  errorText: {
    ...typography.caption,
    color: colors.overdue,
    marginBottom: 12,
    marginLeft: 4,
  },
  saveButton: {
    height: 52,
    backgroundColor: colors.surface,
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    ...shadow,
  },
  saveButtonDisabled: {
    opacity: 0.45,
  },
  buttonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    ...typography.taskTitle,
    color: colors.text,
  },
});
