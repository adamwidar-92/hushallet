import type { Slice } from "@/components/PieChart";
import type { Chore, ChoreCompletion, HouseholdMember } from "@/types/database";

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

export type ChoreStats = { chore: Chore; slices: Slice[] };

/**
 * Ren funktion: total fördelning (med vikter) + fördelning per syssla.
 * Sysslor utan utföranden under perioden tas bort.
 *
 * Exempel på att vikterna räknas:
 *   🦊 gör "Tvätta" (vikt 8) 1 gång, 🐙 gör "Diska" (vikt 2) 2 gånger
 *   → total: 🦊 = 8, 🐙 = 4. 🦊 får störst tårtbit trots färre utföranden.
 */
export function getStatistics(
  chores: Chore[],
  completions: ChoreCompletion[],
  members: HouseholdMember[],
): { total: Slice[]; perChore: ChoreStats[] } {
  const weightOf = new Map(chores.map((c) => [c.id, c.weight]));

  return {
    total: getDistribution(
      completions,
      members,
      (c) => weightOf.get(c.chore_id) ?? 0,
    ),
    perChore: chores
      .map((chore) => ({
        chore,
        slices: getDistribution(
          completions.filter((c) => c.chore_id === chore.id),
          members,
        ),
      }))
      .filter((s) => s.slices.length > 0),
  };
}
