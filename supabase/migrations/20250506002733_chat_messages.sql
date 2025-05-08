create table chat_messages (
  id         bigserial primary key,
  user_id    uuid not null,
  role       text check (role in ('user','assistant')),
  content    text,
  created_at timestamptz default now()
);

alter table chat_messages enable row level security;

create policy "User can select own" on chat_messages
  for select using (auth.uid() = user_id);

create policy "User can insert own" on chat_messages
  for insert with check (auth.uid() = user_id);