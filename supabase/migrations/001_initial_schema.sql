-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  monthly_income numeric(12, 2),
  created_at timestamptz default now()
);

-- Expenses table
create table if not exists public.expenses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  category text not null default 'needs' check (category in ('needs', 'wants', 'savings', 'investing')),
  recurring boolean not null default true,
  created_at timestamptz default now()
);

-- Goals table
create table if not exists public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  target_amount numeric(12, 2) not null check (target_amount > 0),
  current_amount numeric(12, 2) not null default 0 check (current_amount >= 0),
  target_date date not null,
  created_at timestamptz default now()
);

-- Split config table
create table if not exists public.split_configs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  needs_pct numeric(5, 2) not null default 50 check (needs_pct >= 0 and needs_pct <= 100),
  wants_pct numeric(5, 2) not null default 20 check (wants_pct >= 0 and wants_pct <= 100),
  savings_pct numeric(5, 2) not null default 20 check (savings_pct >= 0 and savings_pct <= 100),
  invest_pct numeric(5, 2) not null default 10 check (invest_pct >= 0 and invest_pct <= 100),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.expenses enable row level security;
alter table public.goals enable row level security;
alter table public.split_configs enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Expenses policies
create policy "Users can view own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

create policy "Users can delete own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- Goals policies
create policy "Users can view own goals"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "Users can delete own goals"
  on public.goals for delete
  using (auth.uid() = user_id);

-- Split configs policies
create policy "Users can view own split config"
  on public.split_configs for select
  using (auth.uid() = user_id);

create policy "Users can insert own split config"
  on public.split_configs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own split config"
  on public.split_configs for update
  using (auth.uid() = user_id);

create policy "Users can upsert own split config"
  on public.split_configs for insert
  with check (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
