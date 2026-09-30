import { useMemo, useState } from 'react';
import { Target } from 'lucide-react';
import type { Goal, Task, GoalCategory, Priority } from '@/types';
import { GoalForm } from '@/components/GoalForm';
import { GoalDetail, EmptyState } from '@/components/GoalDetail';
import { goalProgress } from '@/components/ui';

interface MyGoalsProps {
  goals: Goal[];
  tasks: Task[];
  onAddGoal: (text: string, category: GoalCategory, targetDate: string, priority: Priority, reason: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
  onAddTask: (goalId: string, title: string, dueDate: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onClearCompleted: () => void;
}

type FilterType = 'all' | 'active' | 'completed';

export function MyGoals({
  goals,
  tasks,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onClearCompleted,
}: MyGoalsProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [showForm, setShowForm] = useState(false);

  const filteredGoals = useMemo(() => {
    const sorted = [...goals].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.createdAt - a.createdAt;
    });
    if (filter === 'active') return sorted.filter((g) => !g.completed);
    if (filter === 'completed') return sorted.filter((g) => g.completed);
    return sorted;
  }, [goals, filter]);

  const completedCount = goals.filter((g) => g.completed).length;
  const activeCount = goals.length - completedCount;

  const filters: { label: string; value: FilterType; count: number }[] = [
    { label: 'All', value: 'all', count: goals.length },
    { label: 'Active', value: 'active', count: activeCount },
    { label: 'Completed', value: 'completed', count: completedCount },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">My Goals</h1>
          <p className="mt-0.5 text-xs text-slate-400">
            {goals.length} {goals.length === 1 ? 'goal' : 'goals'} · {goals.length > 0 && `${Math.round((completedCount / goals.length) * 100)}% complete`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
        >
          <Target className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New Goal</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {showForm && (
        <>
          <GoalForm onAdd={(text, cat, date, pri, reason) => { onAddGoal(text, cat, date, pri, reason); setShowForm(false); }} />
          <button
            onClick={() => setShowForm(false)}
            className="text-xs font-medium text-slate-400 transition hover:text-slate-600"
          >
            Cancel
          </button>
        </>
      )}

      {goals.length > 0 && (
        <>
          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  filter === f.value ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-100 hover:bg-slate-50'
                }`}
              >
                {f.label}
                <span className={`text-[10px] ${filter === f.value ? 'text-slate-300' : 'text-slate-300'}`}>
                  {f.count}
                </span>
              </button>
            ))}
            {completedCount > 0 && (
              <button
                onClick={onClearCompleted}
                className="ml-auto text-xs font-medium text-slate-400 transition hover:text-red-500"
              >
                Clear done
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredGoals.map((goal) => (
              <GoalDetail
                key={goal.id}
                goal={goal}
                tasks={tasks}
                onToggleGoal={onToggleGoal}
                onDeleteGoal={onDeleteGoal}
                onAddTask={onAddTask}
                onToggleTask={onToggleTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </div>
        </>
      )}

      {goals.length === 0 && (
        <>
          {!showForm && (
            <>
              <EmptyState
                icon={Target}
                title="No goals yet"
                message="Create your first goal to start tracking your progress"
              />
              <button
                onClick={() => setShowForm(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98]"
              >
                <Target className="h-4 w-4" />
                Create Your First Goal
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
