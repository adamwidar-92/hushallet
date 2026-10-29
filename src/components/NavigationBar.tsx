import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, typography } from "@/theme/colors";

type Props = {
  title: string;
  subtitle: string;
  onPrev?: () => void;
  onNext?: () => void;
  onTitlePress?: () => void;
  onBack?: () => void;
};

export function NavigationBar({ title, subtitle, onPrev, onNext, onTitlePress, onBack }: Props) {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      {onBack && (
        <Pressable onPress={onBack} hitSlop={12} style={[styles.back, { top: top + 4 }]}>
          <Feather name="home" size={22} color={colors.text} />
        </Pressable>
      )}
      <Pressable onPress={onTitlePress} disabled={!onTitlePress}>
        <Text style={styles.title}>{title}</Text>
      </Pressable>
      <View style={styles.row}>
        <Arrow name="chevron-left" onPress={onPrev} />
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Arrow name="chevron-right" onPress={onNext} />
      </View>
    </View>
  );
}

type ArrowProps = {
  name: "chevron-left" | "chevron-right";
  onPress?: () => void;
};

/** Pilen döljs (men tar plats) när det inte finns någon vy att byta till. */
function Arrow({ name, onPress }: ArrowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      hitSlop={12}
      style={{ opacity: onPress ? 1 : 0 }}
    >
      <Feather name={name} size={24} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: { ...typography.title, color: colors.text },
  back: { position: "absolute", left: 12 },
  row: {
    height: 28,
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  subtitle: { ...typography.subtitle, color: colors.text },
});
