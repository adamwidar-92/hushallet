import type { AvatarEmoji, Chore, ChoreCompletion, HouseholdMember } from '@/types/database';

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Antal hela kalenderdagar mellan två tidpunkter. */
export function daysBetween(from: Date, to: Date) {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS);
}

export type ChoreStatus = {
  chore: Chore;
  /** Avatarer för de som gjort sysslan idag. */
  doneTodayBy: { avatar: AvatarEmoji; color: string }[];
  /** Dagar sedan senast gjord (eller sedan sysslan skapades). */
  daysSince: number;
  lastDoneAt: Date | null;
  overdue: boolean;
};

export function buildChoreStatuses(
  chores: Chore[],
  completions: ChoreCompletion[],
  members: HouseholdMember[],
  now = new Date(),
): ChoreStatus[] {
  return chores.map((chore) => {
    const own = completions.filter((c) => c.chore_id === chore.id);
    const last = own[0] ? new Date(own[0].completed_at) : null;
    const daysSince = daysBetween(last ?? new Date(chore.created_at), now);
    const todayIds = new Set(own.filter((c) => daysBetween(new Date(c.completed_at), now) === 0).map((c) => c.member_id));
    const doneTodayBy = members
      .filter((m) => todayIds.has(m.id))
      .map((m) => ({ avatar: m.avatar, color: m.avatar_color }));
    return { chore, doneTodayBy, daysSince, lastDoneAt: last, overdue: doneTodayBy.length === 0 && daysSince >= chore.frequency_days };
  });
}
