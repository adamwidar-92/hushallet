import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Avatar } from "../types/database";

interface AvatarBadgeProps {
  avatar: Avatar;
  color: string;
  size?: number;
  style?: ViewStyle;
}

export const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  avatar,
  color,
  size = 40,
  style,
}) => {
  const fontSize = Math.round(size * 0.55);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={`Avatar ${avatar}`}
    >
      <Text style={{ fontSize }}>{avatar}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
