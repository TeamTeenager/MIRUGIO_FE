-- 사용자 프로필 (Auth와 연동)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  streak int not null default 0,
  last_procrastinated_date text,
  created_at timestamptz default now()
);

-- 할일 & 미룬 기록
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  importance smallint not null check (importance between 1 and 5),
  status text not null check (status in ('procrastinated', 'completed')) default 'procrastinated',
  created_at timestamptz default now(),
  procrastinated_at timestamptz default now()
);

-- 건물 층
create table if not exists floors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  task_id uuid references tasks(id) on delete cascade not null,
  title text not null,
  importance smallint not null check (importance between 1 and 5),
  position int not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table tasks enable row level security;
alter table floors enable row level security;

create policy "본인 프로필만 접근" on profiles
  for all using (auth.uid() = id);

create policy "본인 할일만 접근" on tasks
  for all using (auth.uid() = user_id);

create policy "본인 층만 접근" on floors
  for all using (auth.uid() = user_id);

-- 새 유저 가입 시 프로필 자동 생성
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
