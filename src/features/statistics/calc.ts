import type { Slice } from "@/components/PieChart";
import type { ChoreCompletion, HouseholdMember } from "@/types/database";

/**
 * Ren funktion: fördelningen av utföranden per medlem, som tårtbitar.
 * `valueOf` avgör vad ett utförande är värt (standard 1 = antal).
 */
export function getDistribution(
  completions: ChoreCompletion[],
  members: HouseholdMember[],
  valueOf: (c: ChoreCompletion) => number = () => 1,
): Slice[] {
  return members
    .map((m) => ({
      key: m.id,
      color: m.avatar_color,
      emoji: m.avatar,
      value: completions
        .filter((c) => c.member_id === m.id)
        .reduce((sum, c) => sum + valueOf(c), 0),
    }))
    .filter((s) => s.value > 0);
}
