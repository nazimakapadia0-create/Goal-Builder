export type GoalCategory = 'Learning' | 'Health' | 'Personal' | 'Career';
export type Priority = 'low' | 'medium' | 'high';
export type Mood = 'great' | 'good' | 'okay' | 'challenging';
export type PageId = 'dashboard' | 'goals' | 'today' | 'progress' | 'settings';

export interface Goal {
  id: string;
  text: string;
  category: GoalCategory;
  targetDate: string;
  completed: boolean;
  createdAt: number;
  priority: Priority;
  reason: string;
}

export interface Task {
  id: string;
  goalId: string;
  title: string;
  completed: boolean;
  dueDate: string;
  createdAt: number;
  orderIndex: number;
}

export interface Reflection {
  id: string;
  goalId: string | null;
  content: string;
  mood: Mood | null;
  createdAt: number;
}

export interface StreakDay {
  date: string;
  completedCount: number;
}

export const CATEGORIES: GoalCategory[] = ['Learning', 'Health', 'Personal', 'Career'];

export const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

export const MOODS: Mood[] = ['great', 'good', 'okay', 'challenging'];

export const CATEGORY_STYLES: Record<GoalCategory, { bg: string; text: string; dot: string; ring: string; gradient: string }> = {
  Learning: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    ring: 'ring-blue-200',
    gradient: 'from-blue-500 to-blue-600',
  },
  Health: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-200',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  Personal: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    ring: 'ring-amber-200',
    gradient: 'from-amber-500 to-amber-600',
  },
  Career: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    dot: 'bg-violet-500',
    ring: 'ring-violet-200',
    gradient: 'from-violet-500 to-violet-600',
  },
};

export const PRIORITY_STYLES: Record<Priority, { label: string; bg: string; text: string; border: string; icon: string }> = {
  low: {
    label: 'Low',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    icon: 'text-slate-400',
  },
  medium: {
    label: 'Medium',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: 'text-amber-500',
  },
  high: {
    label: 'High',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: 'text-red-500',
  },
};

export const MOOD_STYLES: Record<Mood, { label: string; emoji: string; bg: string; text: string }> = {
  great: { label: 'Great', emoji: '😄', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  good: { label: 'Good', emoji: '🙂', bg: 'bg-blue-50', text: 'text-blue-700' },
  okay: { label: 'Okay', emoji: '😐', bg: 'bg-amber-50', text: 'text-amber-700' },
  challenging: { label: 'Challenging', emoji: '💪', bg: 'bg-red-50', text: 'text-red-700' },
};
