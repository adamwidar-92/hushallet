import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChoreForm } from "@/components/ChoreForm";
import { useSaveChore } from "@/features/chores/useChores";
import { colors } from "@/theme/colors";

export default function ChoreFormScreen() {
  const save = useSaveChore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <ChoreForm
        heading="Skapa en ny syssla"
        error={save.error?.message}
        onSave={(chore) =>
          save.mutate(chore, { onSuccess: () => router.back() })
        }
        onClose={() => router.back()}
      />
    </SafeAreaView>
  );
}
