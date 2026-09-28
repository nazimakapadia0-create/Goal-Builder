export type GoalCategory = 'Learning' | 'Health' | 'Personal' | 'Career';

export interface Goal {
  id: string;
  text: string;
  category: GoalCategory;
  targetDate: string;
  completed: boolean;
  createdAt: number;
}

export const CATEGORIES: GoalCategory[] = ['Learning', 'Health', 'Personal', 'Career'];

export const CATEGORY_STYLES: Record<GoalCategory, { bg: string; text: string; dot: string; ring: string }> = {
  Learning: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    ring: 'ring-blue-200',
  },
  Health: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-200',
  },
  Personal: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    ring: 'ring-amber-200',
  },
  Career: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    dot: 'bg-violet-500',
    ring: 'ring-violet-200',
  },
};
