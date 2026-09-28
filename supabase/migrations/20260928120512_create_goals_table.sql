/*
# Create goals table (single-tenant, no auth)

1. New Tables
- `goals`
  - `id` (uuid, primary key, auto-generated)
  - `text` (text, not null) — the goal description
  - `category` (text, not null) — one of: Learning, Health, Personal, Career
  - `target_date` (date, nullable) — optional target completion date
  - `completed` (boolean, default false) — whether the goal is done
  - `created_at` (timestamptz, default now()) — when the goal was added

2. Security
- Enable RLS on `goals`.
- Allow anon + authenticated full CRUD because this is a single-tenant app
  with no sign-in screen — all data is intentionally shared/public.

3. Indexes
- `idx_goals_created_at` on `created_at` (desc) for efficient listing.
*/

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  category text NOT NULL CHECK (category IN ('Learning', 'Health', 'Personal', 'Career')),
  target_date date,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_goals_created_at ON goals (created_at DESC);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_goals" ON goals;
CREATE POLICY "anon_select_goals" ON goals FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_goals" ON goals;
CREATE POLICY "anon_insert_goals" ON goals FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_goals" ON goals;
CREATE POLICY "anon_update_goals" ON goals FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_goals" ON goals;
CREATE POLICY "anon_delete_goals" ON goals FOR DELETE
  TO anon, authenticated USING (true);
