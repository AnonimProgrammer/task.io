-- Task.io initial schema
-- Public app (no auth): anon role can read/write all rows.
-- Run this in the Supabase SQL Editor or via `supabase db push`.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.task_status as enum ('to_do', 'in_progress', 'done');
create type public.task_priority as enum ('low', 'medium', 'high');

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- "Omar Ismayilov" -> "OI" (first letter of first word + first letter of last word)
create or replace function public.compute_initials(full_name text)
returns text
language plpgsql
immutable
as $$
declare
  parts text[];
  first_initial text;
  last_initial text;
begin
  parts := regexp_split_to_array(trim(full_name), '\s+');

  if array_length(parts, 1) is null or array_length(parts, 1) = 0 then
    return '?';
  end if;

  first_initial := upper(left(parts[1], 1));

  if array_length(parts, 1) = 1 then
    return first_initial;
  end if;

  last_initial := upper(left(parts[array_length(parts, 1)], 1));
  return first_initial || last_initial;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- team_members
-- ---------------------------------------------------------------------------

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) > 0),
  email text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  initials text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.team_members_set_initials()
returns trigger
language plpgsql
as $$
begin
  new.initials := public.compute_initials(new.full_name);
  return new;
end;
$$;

create trigger team_members_set_initials
before insert or update of full_name on public.team_members
for each row
execute function public.team_members_set_initials();

create trigger team_members_set_updated_at
before update on public.team_members
for each row
execute function public.set_updated_at();

create index team_members_created_at_idx on public.team_members (created_at);

-- ---------------------------------------------------------------------------
-- tasks
-- ---------------------------------------------------------------------------

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  summary text not null check (char_length(trim(summary)) > 0),
  description text,
  assignee_id uuid references public.team_members (id) on delete set null,
  due_at timestamptz not null,
  priority public.task_priority not null default 'medium',
  status public.task_status not null default 'to_do',
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger tasks_set_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();

create index tasks_status_position_idx on public.tasks (status, position);
create index tasks_assignee_id_idx on public.tasks (assignee_id);
create index tasks_due_at_idx on public.tasks (due_at);

-- ---------------------------------------------------------------------------
-- Row Level Security (public, no auth)
-- ---------------------------------------------------------------------------

alter table public.team_members enable row level security;
alter table public.tasks enable row level security;

create policy "Public read team_members"
  on public.team_members
  for select
  to anon, authenticated
  using (true);

create policy "Public insert team_members"
  on public.team_members
  for insert
  to anon, authenticated
  with check (true);

create policy "Public update team_members"
  on public.team_members
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Public delete team_members"
  on public.team_members
  for delete
  to anon, authenticated
  using (true);

create policy "Public read tasks"
  on public.tasks
  for select
  to anon, authenticated
  using (true);

create policy "Public insert tasks"
  on public.tasks
  for insert
  to anon, authenticated
  with check (true);

create policy "Public update tasks"
  on public.tasks
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Public delete tasks"
  on public.tasks
  for delete
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Realtime (optional — enable if you want live board updates)
-- ---------------------------------------------------------------------------

alter publication supabase_realtime add table public.team_members;
alter publication supabase_realtime add table public.tasks;
