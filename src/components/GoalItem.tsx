import { Check, Trash2, Calendar, AlertCircle } from 'lucide-react';
import type { Goal } from '@/types';
import { CATEGORY_STYLES } from '@/types';
import { formatDate, daysUntil, isOverdue } from '@/lib/date';

interface GoalItemProps {
  goal: Goal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalItem({ goal, onToggle, onDelete }: GoalItemProps) {
  const style = CATEGORY_STYLES[goal.category];
  const days = daysUntil(goal.targetDate);
  const overdue = !goal.completed && isOverdue(goal.targetDate);

  return (
    <div
      className={`group animate-slide-in flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-slate-200 ${
        goal.completed ? 'opacity-60' : ''
      }`}
    >
      <button
        onClick={() => onToggle(goal.id)}
        className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
          goal.completed
            ? 'animate-check-pop border-blue-600 bg-blue-600'
            : 'border-slate-300 bg-white hover:border-blue-400'
        }`}
        aria-label={goal.completed ? 'Mark as not completed' : 'Mark as completed'}
      >
        {goal.completed && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium text-slate-800 ${
            goal.completed ? 'line-through decoration-slate-400' : ''
          }`}
        >
          {goal.text}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {goal.category}
          </span>

          {goal.targetDate && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium ${
                overdue ? 'text-red-500' : 'text-slate-400'
              }`}
            >
              {overdue ? <AlertCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
              {formatDate(goal.targetDate)}
              {!goal.completed && days !== null && days >= 0 && (
                <span className="text-slate-300">
                  {days === 0 ? '(today)' : `(${days}d left)`}
                </span>
              )}
              {overdue && days !== null && (
                <span className="text-red-400">
                  ({Math.abs(days)}d overdue)
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(goal.id)}
        className="flex-shrink-0 rounded-lg p-1.5 text-slate-300 transition-all hover:bg-red-50 hover:text-red-500"
        aria-label="Delete goal"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
