import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import type { PageId } from '@/types';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/pages/Dashboard';
import { MyGoals } from '@/pages/MyGoals';
import { Today } from '@/pages/Today';
import { Progress } from '@/pages/Progress';
import { Settings } from '@/pages/Settings';
import { useGoals } from '@/hooks/useGoals';

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const {
    goals,
    tasks,
    reflections,
    streakDays,
    addGoal,
    toggleGoal,
    deleteGoal,
    clearCompleted,
    addTask,
    toggleTask,
    deleteTask,
    addReflection,
    deleteReflection,
    error,
  } = useGoals();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation current={page} onNavigate={setPage} />

      {/* Main content — offset for desktop sidebar */}
      <main className="lg:pl-60">
        <div className="mx-auto max-w-2xl px-4 pt-6 pb-28 sm:px-6 sm:pt-10 lg:pb-12">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {page === 'dashboard' && (
            <Dashboard goals={goals} tasks={tasks} streakDays={streakDays} onNavigate={setPage} />
          )}
          {page === 'goals' && (
            <MyGoals
              goals={goals}
              tasks={tasks}
              onAddGoal={addGoal}
              onToggleGoal={toggleGoal}
              onDeleteGoal={deleteGoal}
              onAddTask={addTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onClearCompleted={clearCompleted}
            />
          )}
          {page === 'today' && (
            <Today
              goals={goals}
              tasks={tasks}
              streakDays={streakDays}
              onToggleTask={toggleTask}
              onToggleGoal={toggleGoal}
            />
          )}
          {page === 'progress' && (
            <Progress
              goals={goals}
              tasks={tasks}
              reflections={reflections}
              streakDays={streakDays}
              onAddReflection={addReflection}
              onDeleteReflection={deleteReflection}
            />
          )}
          {page === 'settings' && <Settings goals={goals} onClearCompleted={clearCompleted} />}
        </div>
      </main>
    </div>
  );
}
