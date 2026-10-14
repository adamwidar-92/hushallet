-- Hushållet: initial schema
create extension if not exists pgcrypto;

-- Enums
create type theme_mode as enum ('light', 'dark', 'auto');
create type member_status as enum ('pending', 'active', 'paused');
create type avatar_emoji as enum ('🦊','🐷','🐸','🐥','🐙','🐬','🦉','🦄');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  theme theme_mode not null default 'auto',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Join code generator (6 chars, no ambiguous characters)
create or replace function public.generate_join_code() returns text
language plpgsql volatile as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.households h where h.join_code = code);
  end loop;
  return code;
end $$;

-- Households
create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  join_code text not null unique default public.generate_join_code(),
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

-- Members
create table public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  avatar avatar_emoji not null,
  avatar_color text not null default '#F4A261',
  is_owner boolean not null default false,
  status member_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (household_id, user_id),
  unique (household_id, avatar)
);

create table public.pause_periods (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.household_members(id) on delete cascade,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  check (ends_at is null or ends_at > starts_at)
);

-- Chores
create table public.chores (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  description text not null default '',
  frequency_days int not null default 7 check (frequency_days > 0),
  weight int not null default 1 check (weight in (1, 2, 4, 6, 8)),
  image_url text,
  audio_url text,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.chore_completions (
  id uuid primary key default gen_random_uuid(),
  chore_id uuid not null references public.chores(id) on delete cascade,
  member_id uuid not null references public.household_members(id) on delete cascade,
  completed_at timestamptz not null default now()
);
create index on public.chore_completions (chore_id, completed_at desc);

create table public.chore_groups (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  rotation_interval_days int not null default 7 check (rotation_interval_days > 0),
  rotation_started_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.chores add column group_id uuid references public.chore_groups(id) on delete set null;

create table public.chore_assignments (
  id uuid primary key default gen_random_uuid(),
  chore_id uuid not null references public.chores(id) on delete cascade,
  member_id uuid not null references public.household_members(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  unique (chore_id, member_id)
);

-- Helper functions (security definer to avoid RLS recursion)
create or replace function public.is_member(hid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from household_members
    where household_id = hid and user_id = auth.uid() and status in ('active','paused'));
$$;

create or replace function public.is_owner(hid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from household_members
    where household_id = hid and user_id = auth.uid() and is_owner and status = 'active');
$$;

create or replace function public.member_household(mid uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select household_id from household_members where id = mid;
$$;

create or replace function public.chore_household(cid uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select household_id from chores where id = cid;
$$;

-- RPC: create household (creator becomes active owner)
create or replace function public.create_household(p_name text, p_avatar avatar_emoji, p_color text default '#F4A261')
returns public.households
language plpgsql security definer set search_path = public as $$
declare h households;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  insert into households (name, created_by) values (p_name, auth.uid()) returning * into h;
  insert into household_members (household_id, user_id, avatar, avatar_color, is_owner, status)
  values (h.id, auth.uid(), p_avatar, p_color, true, 'active');
  return h;
end $$;

-- RPC: request to join by code (creates pending membership)
create or replace function public.request_join(p_code text, p_avatar avatar_emoji, p_color text default '#F4A261')
returns public.household_members
language plpgsql security definer set search_path = public as $$
declare hid uuid; m household_members;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select id into hid from households where join_code = upper(trim(p_code));
  if hid is null then raise exception 'invalid code'; end if;
  insert into household_members (household_id, user_id, avatar, avatar_color, status)
  values (hid, auth.uid(), p_avatar, p_color, 'pending') returning * into m;
  return m;
end $$;

-- RPC: avatars taken in a household (callable before joining)
create or replace function public.taken_avatars(p_code text) returns setof avatar_emoji
language sql stable security definer set search_path = public as $$
  select m.avatar from household_members m join households h on h.id = m.household_id
  where h.join_code = upper(trim(p_code));
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.pause_periods enable row level security;
alter table public.chores enable row level security;
alter table public.chore_completions enable row level security;
alter table public.chore_groups enable row level security;
alter table public.chore_assignments enable row level security;

-- profiles: own row + co-members can read
create policy profiles_select on public.profiles for select using (
  id = auth.uid() or exists (
    select 1 from household_members m where m.user_id = profiles.id and public.is_member(m.household_id)));
create policy profiles_update on public.profiles for update using (id = auth.uid());

-- households
create policy households_select on public.households for select using (public.is_member(id));
create policy households_update on public.households for update using (public.is_owner(id));
create policy households_delete on public.households for delete using (public.is_owner(id));

-- members: members see household (incl. pending requests); user sees own rows
create policy members_select on public.household_members for select using (
  user_id = auth.uid() or public.is_member(household_id));
create policy members_owner_update on public.household_members for update using (public.is_owner(household_id));
create policy members_self_update on public.household_members for update using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy members_delete on public.household_members for delete using (
  user_id = auth.uid() or public.is_owner(household_id));

-- Prevent non-owners from promoting themselves / changing status
create or replace function public.guard_member_update() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner(old.household_id) and
     (new.is_owner is distinct from old.is_owner or new.status is distinct from old.status
      or new.household_id is distinct from old.household_id) then
    raise exception 'only owners can change role or status';
  end if;
  return new;
end $$;
create trigger household_members_guard before update on public.household_members
  for each row execute function public.guard_member_update();

-- pause periods
create policy pause_select on public.pause_periods for select using (public.is_member(public.member_household(member_id)));
create policy pause_owner_all on public.pause_periods for all using (public.is_owner(public.member_household(member_id)))
  with check (public.is_owner(public.member_household(member_id)));

-- chores
create policy chores_select on public.chores for select using (public.is_member(household_id));
create policy chores_owner_all on public.chores for all using (public.is_owner(household_id))
  with check (public.is_owner(household_id));

-- completions: members read; members insert own; owner or self delete
create policy completions_select on public.chore_completions for select using (public.is_member(public.chore_household(chore_id)));
create policy completions_insert on public.chore_completions for insert with check (
  exists (select 1 from household_members m where m.id = member_id and m.user_id = auth.uid()
          and m.status = 'active' and m.household_id = public.chore_household(chore_id)));
create policy completions_delete on public.chore_completions for delete using (
  public.is_owner(public.chore_household(chore_id))
  or exists (select 1 from household_members m where m.id = member_id and m.user_id = auth.uid()));

-- groups & assignments
create policy groups_select on public.chore_groups for select using (public.is_member(household_id));
create policy groups_owner_all on public.chore_groups for all using (public.is_owner(household_id))
  with check (public.is_owner(household_id));
create policy assignments_select on public.chore_assignments for select using (public.is_member(public.chore_household(chore_id)));
create policy assignments_owner_all on public.chore_assignments for all using (public.is_owner(public.chore_household(chore_id)))
  with check (public.is_owner(public.chore_household(chore_id)));

-- Storage buckets (path convention: <household_id>/<file>)
insert into storage.buckets (id, name, public) values
  ('chore-images', 'chore-images', false),
  ('chore-audio', 'chore-audio', false)
on conflict (id) do nothing;

create policy chore_media_select on storage.objects for select using (
  bucket_id in ('chore-images','chore-audio')
  and public.is_member(((storage.foldername(name))[1])::uuid));
create policy chore_media_insert on storage.objects for insert with check (
  bucket_id in ('chore-images','chore-audio')
  and public.is_member(((storage.foldername(name))[1])::uuid));
create policy chore_media_delete on storage.objects for delete using (
  bucket_id in ('chore-images','chore-audio')
  and public.is_owner(((storage.foldername(name))[1])::uuid));
