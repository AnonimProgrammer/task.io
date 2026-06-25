-- Optional seed data for local testing.
-- Safe to run multiple times only on a fresh database.

insert into public.team_members (full_name, email)
values
  ('Omar Ismayilov', 'omar@example.com'),
  ('Jane Doe', null),
  ('Alex Smith', 'alex@example.com');

insert into public.tasks (title, summary, description, assignee_id, due_at, priority, status, position)
select
  'Set up Supabase',
  'Create project and run migration',
  'Run persistence/migrations/001_initial_schema.sql in the SQL editor.',
  (select id from public.team_members where full_name = 'Omar Ismayilov' limit 1),
  timezone('utc', now()) + interval '2 days',
  'high'::public.task_priority,
  'in_progress'::public.task_status,
  0
union all
select
  'Design task board UI',
  'Three-column kanban with team avatars',
  null,
  (select id from public.team_members where full_name = 'Jane Doe' limit 1),
  timezone('utc', now()) + interval '5 days',
  'medium'::public.task_priority,
  'to_do'::public.task_status,
  0
union all
select
  'Ship MVP',
  'Public page with no auth',
  null,
  null,
  timezone('utc', now()) + interval '7 days',
  'low'::public.task_priority,
  'to_do'::public.task_status,
  1;
