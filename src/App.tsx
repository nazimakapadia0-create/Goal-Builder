import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { GoalForm } from '@/components/GoalForm';
import { GoalList } from '@/components/GoalList';
import { StatsBar } from '@/components/StatsBar';
import { useGoals } from '@/hooks/useGoals';
import type { Goal } from '@/types';

type FilterType = 'all' | 'active' | 'completed';

export default function App() {
  const { goals, addGoal, toggleGoal, deleteGoal, clearCompleted } = useGoals();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredGoals = useMemo(() => {
    const sorted = [...goals].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.createdAt - a.createdAt;
    });
    if (filter === 'active') return sorted.filter((g: Goal) => !g.completed);
    if (filter === 'completed') return sorted.filter((g: Goal) => g.completed);
    return sorted;
  }, [goals, filter]);

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <div className="animate-fade-in space-y-6">
          <Header />

          <GoalForm onAdd={addGoal} />

          {goals.length > 0 && (
            <>
              <StatsBar goals={goals} onClearCompleted={clearCompleted} />

              <div className="flex gap-1.5">
                {filters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                      filter === f.value
                        ? 'bg-slate-800 text-white'
                        : 'bg-white text-slate-500 ring-1 ring-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </>
          )}

          <GoalList goals={filteredGoals} onToggle={toggleGoal} onDelete={deleteGoal} />
        </div>
      </div>
    </div>
  );
}
