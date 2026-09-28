import type { Goal, GoalCategory } from '@/types';

interface GoalRow {
  id: string;
  text: string;
  category: GoalCategory;
  target_date: string | null;
  completed: boolean;
  created_at: string;
}

export function rowToGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    text: row.text,
    category: row.category,
    targetDate: row.target_date ?? '',
    completed: row.completed,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export function goalToInsert(goal: { text: string; category: GoalCategory; targetDate: string }) {
  return {
    text: goal.text.trim(),
    category: goal.category,
    target_date: goal.targetDate || null,
  };
}
