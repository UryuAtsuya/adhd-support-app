-- Extensions
create extension if not exists pgcrypto;

-- Utility function for updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  priority text not null check (priority in ('low', 'medium', 'high')),
  status text not null check (status in ('todo', 'in_progress', 'done')),
  due_date date,
  subtasks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_tasks_due_date on public.tasks(due_date);
create index if not exists idx_tasks_status on public.tasks(status);

create trigger set_tasks_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();

-- Habits
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  frequency text not null check (frequency in ('daily', 'weekly')),
  target_days int[] not null default '{1,2,3,4,5,6,7}',
  color text not null default '#3B82F6',
  target_count int,
  reminder_time text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_habits_user_id on public.habits(user_id);

create trigger set_habits_updated_at
before update on public.habits
for each row
execute function public.set_updated_at();

-- Habit logs
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_at timestamptz not null default timezone('utc', now()),
  date date not null,
  unique (habit_id, date)
);

create index if not exists idx_habit_logs_user_id on public.habit_logs(user_id);
create index if not exists idx_habit_logs_habit_id on public.habit_logs(habit_id);
create index if not exists idx_habit_logs_date on public.habit_logs(date);

-- Pomodoro sessions
create table if not exists public.pomodoro_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  duration int not null check (duration > 0),
  completed boolean not null default true,
  started_at timestamptz not null,
  ended_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_pomodoro_sessions_user_id on public.pomodoro_sessions(user_id);
create index if not exists idx_pomodoro_sessions_started_at on public.pomodoro_sessions(started_at);

-- Billing tables
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  plan_code text not null unique,
  name text not null,
  monthly_price_jpy int not null default 0,
  yearly_price_jpy int,
  is_active boolean not null default true,
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_plans_updated_at
before update on public.plans
for each row
execute function public.set_updated_at();

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'manual',
  provider_subscription_id text unique,
  plan_code text not null references public.plans(plan_code),
  status text not null check (status in ('trialing', 'active', 'past_due', 'canceled', 'incomplete')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row
execute function public.set_updated_at();

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  occurred_at timestamptz not null default timezone('utc', now()),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_usage_events_user_id on public.usage_events(user_id);
create index if not exists idx_usage_events_event_type on public.usage_events(event_type);

-- Seed plans (idempotent)
insert into public.plans (plan_code, name, monthly_price_jpy, yearly_price_jpy, features)
values
  ('free', 'Free', 0, 0, '["core_tasks", "core_habits", "core_timer"]'::jsonb),
  ('pro', 'Pro', 980, 9800, '["insights", "history_unlimited", "smart_reminders"]'::jsonb)
on conflict (plan_code) do nothing;

-- Create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.pomodoro_sessions enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_events enable row level security;

-- Profiles
create policy "Users can select own profile"
on public.profiles for select
using (id = auth.uid());

create policy "Users can update own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

-- Tasks
create policy "Users can CRUD own tasks"
on public.tasks for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Habits
create policy "Users can CRUD own habits"
on public.habits for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Habit logs
create policy "Users can CRUD own habit logs"
on public.habit_logs for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Pomodoro sessions
create policy "Users can CRUD own pomodoro sessions"
on public.pomodoro_sessions for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Plans are readable by all authenticated users
create policy "Authenticated users can read plans"
on public.plans for select
using (auth.uid() is not null);

-- Subscriptions
create policy "Users can read own subscriptions"
on public.subscriptions for select
using (user_id = auth.uid());

create policy "Users can insert own subscriptions"
on public.subscriptions for insert
with check (user_id = auth.uid());

create policy "Users can update own subscriptions"
on public.subscriptions for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Usage events
create policy "Users can CRUD own usage events"
on public.usage_events for all
using (user_id = auth.uid())
with check (user_id = auth.uid());
