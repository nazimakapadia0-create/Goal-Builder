import type { Goal, Task } from '@/types';
import { CATEGORY_STYLES } from '@/types';
import { daysUntil, formatDateShort, isOverdue } from '@/lib/date';

export function goalProgress(goal: Goal, tasks: Task[]): number {
  const goalTasks = tasks.filter((t) => t.goalId === goal.id);
  if (goalTasks.length === 0) {
    return goal.completed ? 100 : 0;
  }
  const done = goalTasks.filter((t) => t.completed).length;
  return Math.round((done / goalTasks.length) * 100);
}

interface ProgressBarProps {
  value: number;
  gradient?: string;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, gradient, size = 'md' }: ProgressBarProps) {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-slate-100 ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          gradient ? `bg-gradient-to-r ${gradient}` : 'bg-gradient-to-r from-blue-500 to-blue-600'
        }`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

interface DeadlineBadgeProps {
  date: string;
  completed: boolean;
}

export function DeadlineBadge({ date, completed }: DeadlineBadgeProps) {
  if (!date) return null;
  const days = daysUntil(date);
  const overdue = !completed && isOverdue(date);

  if (overdue) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
        {Math.abs(days!)}d overdue
      </span>
    );
  }
  if (days === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
        Due today
      </span>
    );
  }
  if (days !== null && days > 0 && days <= 7) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500">
        {days}d left
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
      {formatDateShort(date)}
    </span>
  );
}

interface CategoryBadgeProps {
  category: keyof typeof CATEGORY_STYLES;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const style = CATEGORY_STYLES[category];
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {category}
    </span>
  );
}
