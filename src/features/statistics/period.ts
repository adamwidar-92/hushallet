import type { ChoreCompletion } from "@/types/database";

export type PeriodKey = "currentWeek" | "lastWeek" | "lastMonth";
export type Period = { start: Date; end: Date; label: string };

const addDays = (d: Date, days: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);

export function getPeriod(key: PeriodKey, now = new Date()): Period {
  const monday = addDays(now, -((now.getDay() + 6) % 7));

  switch (key) {
    case "currentWeek":
      return {
        start: monday,
        end: addDays(monday, 7),
        label: "nuvarande vecka",
      };
    case "lastWeek":
      return { start: addDays(monday, -7), end: monday, label: "förra veckan" };
    case "lastMonth":
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 1),
        label: "förra månaden",
      };
  }
}

export function filterByPeriod(
  completions: ChoreCompletion[],
  { start, end }: Period,
) {
  return completions.filter((c) => {
    const date = new Date(c.completed_at);
    return date >= start && date < end;
  });
}
