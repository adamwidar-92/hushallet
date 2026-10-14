// Handskrivna typer som speglar supabase/migrations/0001_init.sql.
// Kan ersättas med: npx supabase gen types typescript --project-id <id>

export type ThemeMode = 'light' | 'dark' | 'auto';
export type MemberStatus = 'pending' | 'active' | 'paused';
export type AvatarEmoji = '🦊' | '🐷' | '🐸' | '🐥' | '🐙' | '🐬' | '🦉' | '🦄';
export type ChoreWeight = 1 | 2 | 4 | 6 | 8;

export const AVATARS: readonly AvatarEmoji[] = ['🦊', '🐷', '🐸', '🐥', '🐙', '🐬', '🦉', '🦄'];
export const CHORE_WEIGHTS: readonly ChoreWeight[] = [1, 2, 4, 6, 8];

type Table<Row, Required extends keyof Row = never> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, Required>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Profile = { id: string; name: string; theme: ThemeMode; created_at: string }
export type Household = { id: string; name: string; join_code: string; created_by: string | null; created_at: string }
export type HouseholdMember = {
  id: string; household_id: string; user_id: string; avatar: AvatarEmoji; avatar_color: string;
  is_owner: boolean; status: MemberStatus; created_at: string;
}
export type PausePeriod = { id: string; member_id: string; starts_at: string; ends_at: string | null }
export type Chore = {
  id: string; household_id: string; group_id: string | null; name: string; description: string;
  frequency_days: number; weight: ChoreWeight; image_url: string | null; audio_url: string | null;
  archived: boolean; created_at: string;
}
export type ChoreCompletion = { id: string; chore_id: string; member_id: string; completed_at: string }
export type ChoreGroup = {
  id: string; household_id: string; name: string; rotation_interval_days: number;
  rotation_started_at: string; created_at: string;
}
export type ChoreAssignment = { id: string; chore_id: string; member_id: string; assigned_at: string }

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile, 'id'>;
      households: Table<Household, 'name'>;
      household_members: Table<HouseholdMember, 'household_id' | 'user_id' | 'avatar'>;
      pause_periods: Table<PausePeriod, 'member_id'>;
      chores: Table<Chore, 'household_id' | 'name'>;
      chore_completions: Table<ChoreCompletion, 'chore_id' | 'member_id'>;
      chore_groups: Table<ChoreGroup, 'household_id' | 'name'>;
      chore_assignments: Table<ChoreAssignment, 'chore_id' | 'member_id'>;
    };
    Views: { [_ in never]: never };
    Functions: {
      create_household: { Args: { p_name: string; p_avatar: AvatarEmoji; p_color?: string }; Returns: Household };
      request_join: { Args: { p_code: string; p_avatar: AvatarEmoji; p_color?: string }; Returns: HouseholdMember };
      taken_avatars: { Args: { p_code: string }; Returns: AvatarEmoji[] };
      generate_join_code: { Args: Record<string, never>; Returns: string };
      is_member: { Args: { hid: string }; Returns: boolean };
      is_owner: { Args: { hid: string }; Returns: boolean };
    };
    Enums: { theme_mode: ThemeMode; member_status: MemberStatus; avatar_emoji: AvatarEmoji };
    CompositeTypes: { [_ in never]: never };
  };
};
