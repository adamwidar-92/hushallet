/**
 * Mockdata för att bygga och testa vyer innan backend-koden är på plats.
 * Formen matchar typerna i src/types/database.ts och tabellerna i
 * supabase/migrations/0001_init.sql.
 *
 * Utförandena (completions) genereras relativt till dagens datum, så det
 * alltid finns data för "nuvarande vecka", "förra veckan" och "förra månaden".
 */
import type {
  Chore,
  ChoreAssignment,
  ChoreCompletion,
  ChoreGroup,
  Household,
  HouseholdMember,
  PausePeriod,
  Profile,
} from '@/types/database';

const DAY = 24 * 60 * 60 * 1000;
const now = new Date();
const daysAgo = (days: number, hour = 18) => {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days, hour, 0, 0);
  return d.toISOString();
};

export const mockProfiles: Profile[] = [
  { id: 'user-anna', name: 'Anna Andersson', theme: 'auto', created_at: daysAgo(60) },
  { id: 'user-erik', name: 'Erik Andersson', theme: 'dark', created_at: daysAgo(60) },
  { id: 'user-maja', name: 'Maja Andersson', theme: 'light', created_at: daysAgo(55) },
  { id: 'user-olle', name: 'Olle Andersson', theme: 'auto', created_at: daysAgo(2) },
];

export const mockHousehold: Household = {
  id: 'household-andersson',
  name: 'Familjen Andersson',
  join_code: 'K7M2QX',
  created_by: 'user-anna',
  created_at: daysAgo(60),
};

export const mockMembers: HouseholdMember[] = [
  {
    id: 'member-anna',
    household_id: mockHousehold.id,
    user_id: 'user-anna',
    avatar: '🦊',
    avatar_color: '#FF7E46',
    is_owner: true,
    status: 'active',
    created_at: daysAgo(60),
  },
  {
    id: 'member-erik',
    household_id: mockHousehold.id,
    user_id: 'user-erik',
    avatar: '🐙',
    avatar_color: '#CD5D6F',
    is_owner: false,
    status: 'active',
    created_at: daysAgo(59),
  },
  {
    id: 'member-maja',
    household_id: mockHousehold.id,
    user_id: 'user-maja',
    avatar: '🐥',
    avatar_color: '#FCD933',
    is_owner: false,
    status: 'active',
    created_at: daysAgo(55),
  },
  {
    // Väntar på att en ägare ska godkänna förfrågan.
    id: 'member-olle',
    household_id: mockHousehold.id,
    user_id: 'user-olle',
    avatar: '🐸',
    avatar_color: '#8AB17D',
    is_owner: false,
    status: 'pending',
    created_at: daysAgo(2),
  },
];

/** Erik var pausad en vecka för ~3 veckor sedan (för normalisering i statistiken). */
export const mockPausePeriods: PausePeriod[] = [
  { id: 'pause-1', member_id: 'member-erik', starts_at: daysAgo(24, 0), ends_at: daysAgo(17, 0) },
];

export const mockChoreGroups: ChoreGroup[] = [
  {
    id: 'group-kok',
    household_id: mockHousehold.id,
    name: 'Köket',
    rotation_interval_days: 7,
    rotation_started_at: daysAgo(28, 0),
    created_at: daysAgo(28),
  },
];

const chore = (c: Omit<Chore, 'household_id' | 'image_url' | 'audio_url' | 'archived' | 'created_at' | 'group_id'> & Partial<Chore>): Chore => ({
  household_id: mockHousehold.id,
  image_url: null,
  audio_url: null,
  archived: false,
  group_id: null,
  created_at: daysAgo(50),
  ...c,
});

export const mockChores: Chore[] = [
  chore({ id: 'chore-laga-mat', name: 'Laga mat', description: 'Laga middag till hela familjen.', frequency_days: 1, weight: 4, group_id: 'group-kok' }),
  chore({ id: 'chore-diska', name: 'Diska', description: 'Diska eller kör diskmaskinen och plocka ur den.', frequency_days: 1, weight: 2, group_id: 'group-kok' }),
  chore({ id: 'chore-damma', name: 'Damma', description: 'Damma hyllor, tv-bänk och fönsterbrädor.', frequency_days: 7, weight: 2 }),
  chore({ id: 'chore-torka-golv', name: 'Torka golvet', description: 'Dammsug och våttorka golven i hela lägenheten.', frequency_days: 7, weight: 6 }),
  chore({ id: 'chore-vattna', name: 'Vattna blommor', description: 'Vattna alla krukväxter. Kaktusen bara varannan gång!', frequency_days: 3, weight: 1 }),
  chore({ id: 'chore-ta-hand-om-my', name: 'Ta hand om My', description: 'Mata katten My och rensa kattlådan.', frequency_days: 1, weight: 2 }),
  chore({ id: 'chore-tvatta', name: 'Tvätta', description: 'Tvätta, hänga och vika en maskin.', frequency_days: 4, weight: 8 }),
  chore({
    id: 'chore-gamla-garderoben',
    name: 'Rensa garderoben',
    description: 'Arkiverad syssla – ska inte visas i dagsvyn.',
    frequency_days: 90,
    weight: 4,
    archived: true,
  }),
];

export const mockAssignments: ChoreAssignment[] = [
  { id: 'assign-1', chore_id: 'chore-ta-hand-om-my', member_id: 'member-maja', assigned_at: daysAgo(14) },
  { id: 'assign-2', chore_id: 'chore-torka-golv', member_id: 'member-erik', assigned_at: daysAgo(14) },
];

/** Enkel deterministisk slump så att datan är densamma vid varje körning. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

function generateCompletions(): ChoreCompletion[] {
  const rand = seeded(42);
  const active = ['member-anna', 'member-erik', 'member-maja'];
  const result: ChoreCompletion[] = [];
  const isPaused = (memberId: string, day: number) =>
    mockPausePeriods.some((p) => {
      if (p.member_id !== memberId) return false;
      const t = now.getTime() - day * DAY;
      return t >= new Date(p.starts_at).getTime() && (!p.ends_at || t < new Date(p.ends_at).getTime());
    });

  // Ungefär 5 veckor bakåt. Lämna idag delvis ogjort så dagsvyn har försenade sysslor.
  for (let day = 35; day >= 1; day--) {
    for (const c of mockChores.filter((x) => !x.archived)) {
      // Gör sysslan ungefär enligt frekvensen, med lite slump.
      if (day % c.frequency_days !== 0 && rand() > 0.15) continue;
      if (rand() < 0.15) continue; // ibland glöms den bort
      const candidates = active.filter((m) => !isPaused(m, day));
      const member = candidates[Math.floor(rand() * candidates.length)];
      result.push({
        id: `completion-${result.length + 1}`,
        chore_id: c.id,
        member_id: member,
        completed_at: daysAgo(day, 8 + Math.floor(rand() * 13)),
      });
    }
  }
  // Idag: några gjorda sysslor (med flera personer på samma syssla).
  result.push(
    { id: 'completion-today-1', chore_id: 'chore-laga-mat', member_id: 'member-anna', completed_at: daysAgo(0, 9) },
    { id: 'completion-today-2', chore_id: 'chore-laga-mat', member_id: 'member-erik', completed_at: daysAgo(0, 10) },
    { id: 'completion-today-3', chore_id: 'chore-diska', member_id: 'member-maja', completed_at: daysAgo(0, 11) },
  );
  return result.sort((a, b) => b.completed_at.localeCompare(a.completed_at));
}

export const mockCompletions: ChoreCompletion[] = generateCompletions();

/** Inloggad användare i mockläget. */
export const mockCurrentUserId = 'user-anna';
