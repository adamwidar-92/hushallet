import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AVATAR_COLORS, colors, shadow, typography } from "../theme/colors";
import { Avatar, AVATARS } from "../types/database";

interface AvatarPickerProps {
  selectedAvatar: Avatar | null;
  selectedColor: string;
  onSelectAvatar: (avatar: Avatar) => void;
  onSelectColor: (color: string) => void;
  takenAvatars?: Avatar[];
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  selectedAvatar,
  selectedColor,
  onSelectAvatar,
  onSelectColor,
  takenAvatars = [],
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Välj avatar</Text>
      <View style={styles.grid}>
        {AVATARS.map((avatar) => {
          const isSelected = selectedAvatar === avatar;
          const isTaken = takenAvatars.includes(avatar);

          return (
            <View key={avatar} style={styles.itemWrapper}>
              <TouchableOpacity
                disabled={isTaken}
                onPress={() => onSelectAvatar(avatar)}
                activeOpacity={0.7}
                style={[
                  styles.avatarCircle,
                  isSelected && {
                    backgroundColor: selectedColor,
                    borderColor: colors.text,
                    borderWidth: 2,
                  },
                  isTaken && styles.avatarDisabled,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Välj avatar ${avatar}`}
              >
                <Text style={styles.emojiText}>{avatar}</Text>
              </TouchableOpacity>
              <Text style={styles.statusLabel}>
                {isSelected ? "Vald" : isTaken ? "Upptagen" : ""}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Välj färg</Text>
      <View style={styles.colorRow}>
        {AVATAR_COLORS.map((color) => {
          const isSelected = selectedColor === color;
          return (
            <TouchableOpacity
              key={color}
              onPress={() => onSelectColor(color)}
              activeOpacity={0.8}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                isSelected && styles.colorSelected,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Välj färg ${color}`}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  sectionTitle: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: 8,
    marginTop: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemWrapper: {
    width: "23%",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    ...shadow,
  },
  avatarDisabled: {
    opacity: 0.3,
    backgroundColor: colors.background,
  },
  emojiText: {
    fontSize: 26,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textMuted,
    marginTop: 4,
    height: 14,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    ...shadow,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: colors.text,
  },
});
