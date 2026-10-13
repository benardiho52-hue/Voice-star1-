-- VoiceStar starter database

create extension if not exists pgcrypto;

create table if not exists public.songs (
id uuid primary key default gen_random_uuid(),
title text not null,
artist_name text not null default 'New Artist',
genre text not null default 'Afrobeats',
description text,
audio_url text,
cover_url text,
is_published boolean not null default false,
created_at timestamptz not null default now()
);

create table if not exists public.artists (
id uuid primary key default gen_random_uuid(),
name text not null,
genre text not null default 'Afrobeats',
bio text,
avatar_url text,
created_at timestamptz not null default now()
);

alter table public.songs enable row level security;
alter table public.artists enable row level security;

drop policy if exists "Read published songs" on public.songs;
create policy "Read published songs"
on public.songs for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Publish prototype songs" on public.songs;
create policy "Publish prototype songs"
on public.songs for insert
to anon, authenticated
with check (
char_length(trim(title)) between 1 and 120
and char_length(trim(artist_name)) between 1 and 80
);

drop policy if exists "Read artists" on public.artists;
create policy "Read artists"
on public.artists for select
to anon, authenticated
using (true);

grant select, insert on public.songs to anon, authenticated;
grant select on public.artists to anon, authenticated;
