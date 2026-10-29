create or replace function public.request_join(p_code text, p_avatar avatar_emoji, p_color text default '#F4A261')
returns public.household_members
language plpgsql security definer set search_path = public as $$
declare hid uuid; m household_members;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select id into hid from households where join_code = upper(trim(p_code));
  if hid is null then raise exception 'invalid code'; end if;
  insert into household_members (household_id, user_id, avatar, avatar_color, status)
  values (hid, auth.uid(), p_avatar, p_color, 'active') returning * into m;
  return m;
end $$;

alter table public.household_members disable trigger household_members_guard;
update public.household_members set status = 'active' where status = 'pending';
alter table public.household_members enable trigger household_members_guard;
