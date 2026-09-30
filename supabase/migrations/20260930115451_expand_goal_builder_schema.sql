/*
# Expand goal builder schema: priorities, tasks, streaks, reflections

1. Modified Tables
- `goals`
  - ADD `priority` (text, default 'medium') — one of: low, medium, high
  - ADD `reason` (text, nullable) — the user's motivation for the goal
  - The existing `text` column is renamed conceptually to "goal name" but keeps its column name for backwards compatibility.

2. New Tables
- `tasks`
  - `id` (uuid, primary key)
  - `goal_id` (uuid, foreign key to goals, ON DELETE CASCADE)
  - `title` (text, not null)
  - `completed` (boolean, default false)
  - `due_date` (date, nullable) — when the task should be done
  - `created_at` (timestamptz, default now())
  - `order_index` (integer, default 0) — for manual ordering

- `reflections`
  - `id` (uuid, primary key)
  - `goal_id` (uuid, foreign key to goals, ON DELETE CASCADE, nullable — null = general reflection)
  - `content` (text, not null) — the reflection text
  - `mood` (text, nullable) — one of: great, good, okay, challenging
  - `created_at` (timestamptz, default now())

- `streak_log`
  - `id` (uuid, primary key)
  - `date` (date, not null, unique) — the day the streak activity was logged
  - `completed_count` (integer, default 0) — how many tasks/goals completed that day
  - `created_at` (timestamptz, default now())

3. Security
- RLS enabled on all new tables.
- All tables use `TO anon, authenticated` (single-tenant, no auth screen).
- Full CRUD allowed for anon + authenticated.

4. Indexes
- `idx_tasks_goal_id` on tasks(goal_id)
- `idx_tasks_due_date` on tasks(due_date)
- `idx_reflections_goal_id` on reflections(goal_id)
- `idx_reflections_created_at` on reflections(created_at desc)
- `idx_streak_log_date` on streak_log(date desc)
*/

-- Add new columns to goals
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'goals' AND column_name = 'priority') THEN
    ALTER TABLE goals ADD COLUMN priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'goals' AND column_name = 'reason') THEN
    ALTER TABLE goals ADD COLUMN reason text;
  END IF;
END $$;

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  order_index integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_tasks_goal_id ON tasks(goal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tasks" ON tasks;
CREATE POLICY "anon_select_tasks" ON tasks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tasks" ON tasks;
CREATE POLICY "anon_insert_tasks" ON tasks FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tasks" ON tasks;
CREATE POLICY "anon_update_tasks" ON tasks FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tasks" ON tasks;
CREATE POLICY "anon_delete_tasks" ON tasks FOR DELETE
  TO anon, authenticated USING (true);

-- Reflections table
CREATE TABLE IF NOT EXISTS reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES goals(id) ON DELETE CASCADE,
  content text NOT NULL,
  mood text CHECK (mood IN ('great', 'good', 'okay', 'challenging')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reflections_goal_id ON reflections(goal_id);
CREATE INDEX IF NOT EXISTS idx_reflections_created_at ON reflections(created_at DESC);

ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reflections" ON reflections;
CREATE POLICY "anon_select_reflections" ON reflections FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_reflections" ON reflections;
CREATE POLICY "anon_insert_reflections" ON reflections FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_reflections" ON reflections;
CREATE POLICY "anon_update_reflections" ON reflections FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_reflections" ON reflections;
CREATE POLICY "anon_delete_reflections" ON reflections FOR DELETE
  TO anon, authenticated USING (true);

-- Streak log table
CREATE TABLE IF NOT EXISTS streak_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  completed_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_streak_log_date ON streak_log(date DESC);

ALTER TABLE streak_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_streak_log" ON streak_log;
CREATE POLICY "anon_select_streak_log" ON streak_log FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_streak_log" ON streak_log;
CREATE POLICY "anon_insert_streak_log" ON streak_log FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_streak_log" ON streak_log;
CREATE POLICY "anon_update_streak_log" ON streak_log FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_streak_log" ON streak_log;
CREATE POLICY "anon_delete_streak_log" ON streak_log FOR DELETE
  TO anon, authenticated USING (true);
