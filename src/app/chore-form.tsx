import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChoreForm } from "@/components/ChoreForm";
import { useChores, useSaveChore } from "@/features/chores/useChores";
import { colors } from "@/theme/colors";

export default function ChoreFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const chore = useChores().chores.find((c) => c.id === id);
  const save = useSaveChore();

  if (id && !chore) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <ChoreForm
        heading={chore ? "Ändra syssla" : "Skapa en ny syssla"}
        initial={chore}
        error={save.error?.message}
        onSave={(input) =>
          save.mutate({ ...input, id }, { onSuccess: () => router.back() })
        }
        onClose={() => router.back()}
      />
    </SafeAreaView>
  );
}
