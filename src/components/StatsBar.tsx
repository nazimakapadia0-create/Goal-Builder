import { CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import type { Goal } from '@/types';

interface StatsBarProps {
  goals: Goal[];
  onClearCompleted: () => void;
}

export function StatsBar({ goals, onClearCompleted }: StatsBarProps) {
  const total = goals.length;
  const completed = goals.filter((g) => g.completed).length;
  const active = total - completed;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
            <Circle className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none text-slate-800">{active}</p>
            <p className="text-xs text-slate-400">Active</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none text-slate-800">{completed}</p>
            <p className="text-xs text-slate-400">Completed</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
            <TrendingUp className="h-4 w-4 text-violet-500" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none text-slate-800">{pct}%</p>
            <p className="text-xs text-slate-400">Progress</p>
          </div>
        </div>
      </div>

      {completed > 0 && (
        <button
          onClick={onClearCompleted}
          className="self-start rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 sm:self-auto"
        >
          Clear completed
        </button>
      )}
    </div>
  );
}
