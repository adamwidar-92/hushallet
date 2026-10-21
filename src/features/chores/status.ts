import type {
  Avatar,
  Chore,
  ChoreCompletion,
  HouseholdMember,
} from "@/types/database";

export type ChoreStatus = {
  doneBy: Avatar[];
  daysSince: number;
  overdue: boolean;
};

const DAY = 24 * 60 * 60 * 1000;
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** Antal kalenderdagar mellan två datum (inte 24h-perioder). */
export function calendarDaysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to) - startOfDay(from)) / DAY);
}

/** Ren funktion: vem som gjort sysslan idag, dagar sedan senast och om den är försenad. */
export function getChoreStatus(
  chore: Chore,
  completions: ChoreCompletion[],
  members: HouseholdMember[],
  today = new Date(),
): ChoreStatus {
  const own = completions.filter((c) => c.chore_id === chore.id);
  const doneToday = own.filter(
    (c) => calendarDaysBetween(new Date(c.completed_at), today) === 0,
  );
  const doneBy = members
    .filter((m) => doneToday.some((c) => c.member_id === m.id))
    .map((m) => m.avatar);

  // Aldrig gjord → räkna från när sysslan skapades.
  const last = own.reduce(
    (latest, c) => (c.completed_at > latest ? c.completed_at : latest),
    chore.created_at,
  );
  const daysSince = calendarDaysBetween(new Date(last), today);

  return { doneBy, daysSince, overdue: daysSince >= chore.frequency_days };
}
