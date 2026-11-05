create type public.meal_type as enum ('아침', '점심', '저녁', '간식');

create table public.meal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  eaten_on date not null,
  meal_type public.meal_type not null,
  eaten_at time without time zone not null,
  food text not null
    check (char_length(btrim(food)) between 1 and 120),
  note text not null default ''
    check (char_length(note) <= 300),
  eat_half boolean not null default false,
  created_at timestamptz not null default now()
);

create index meal_entries_user_date_order_idx
  on public.meal_entries (user_id, eaten_on, meal_type, eaten_at, created_at);

alter table public.meal_entries enable row level security;

revoke all on table public.meal_entries from anon, authenticated;
grant select, insert, update, delete on table public.meal_entries to authenticated;

create policy "Users can read their own meal entries"
  on public.meal_entries for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own meal entries"
  on public.meal_entries for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own meal entries"
  on public.meal_entries for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own meal entries"
  on public.meal_entries for delete to authenticated
  using ((select auth.uid()) = user_id);
