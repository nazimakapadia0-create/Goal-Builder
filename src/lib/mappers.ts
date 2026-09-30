import type { Goal, GoalCategory, Priority, Task, Reflection, StreakDay } from '@/types';

interface GoalRow {
  id: string;
  text: string;
  category: GoalCategory;
  target_date: string | null;
  completed: boolean;
  created_at: string;
  priority: Priority;
  reason: string | null;
}

interface TaskRow {
  id: string;
  goal_id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  created_at: string;
  order_index: number;
}

interface ReflectionRow {
  id: string;
  goal_id: string | null;
  content: string;
  mood: string | null;
  created_at: string;
}

interface StreakRow {
  date: string;
  completed_count: number;
}

export function rowToGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    text: row.text,
    category: row.category,
    targetDate: row.target_date ?? '',
    completed: row.completed,
    createdAt: new Date(row.created_at).getTime(),
    priority: row.priority ?? 'medium',
    reason: row.reason ?? '',
  };
}

export function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    goalId: row.goal_id,
    title: row.title,
    completed: row.completed,
    dueDate: row.due_date ?? '',
    createdAt: new Date(row.created_at).getTime(),
    orderIndex: row.order_index ?? 0,
  };
}

export function rowToReflection(row: ReflectionRow): Reflection {
  return {
    id: row.id,
    goalId: row.goal_id,
    content: row.content,
    mood: (row.mood as Reflection['mood']) ?? null,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export function rowToStreakDay(row: StreakRow): StreakDay {
  return {
    date: row.date,
    completedCount: row.completed_count,
  };
}

export function goalToInsert(goal: {
  text: string;
  category: GoalCategory;
  targetDate: string;
  priority: Priority;
  reason: string;
}) {
  return {
    text: goal.text.trim(),
    category: goal.category,
    target_date: goal.targetDate || null,
    priority: goal.priority,
    reason: goal.reason.trim() || null,
  };
}

export function taskToInsert(task: { goalId: string; title: string; dueDate: string }) {
  return {
    goal_id: task.goalId,
    title: task.title.trim(),
    due_date: task.dueDate || null,
  };
}

export function reflectionToInsert(ref: { goalId: string | null; content: string; mood: string | null }) {
  return {
    goal_id: ref.goalId,
    content: ref.content.trim(),
    mood: ref.mood,
  };
}
