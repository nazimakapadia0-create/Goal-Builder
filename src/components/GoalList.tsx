import { Target } from 'lucide-react';
import type { Goal } from '@/types';
import { GoalItem } from './GoalItem';

interface GoalListProps {
  goals: Goal[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalList({ goals, onToggle, onDelete }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center shadow-sm ring-1 ring-slate-100">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
          <Target className="h-7 w-7 text-slate-300" />
        </div>
        <h3 className="text-sm font-semibold text-slate-500">No goals yet</h3>
        <p className="mt-1 text-sm text-slate-400">
          Add your first goal above to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {goals.map((goal) => (
        <GoalItem
          key={goal.id}
          goal={goal}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
