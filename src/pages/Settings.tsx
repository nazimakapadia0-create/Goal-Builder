import { Target, Trash2, Info, Github } from 'lucide-react';
import type { Goal } from '@/types';

interface SettingsProps {
  goals: Goal[];
  onClearCompleted: () => void;
}

export function Settings({ goals, onClearCompleted }: SettingsProps) {
  const completedCount = goals.filter((g) => g.completed).length;

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">Settings</h1>
        <p className="mt-0.5 text-xs text-slate-400">Manage your data and preferences</p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">Data Management</h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
            <div>
              <p className="text-sm font-medium text-slate-700">Clear completed goals</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {completedCount > 0 ? `${completedCount} completed goal${completedCount !== 1 ? 's' : ''} will be removed` : 'No completed goals to clear'}
              </p>
            </div>
            <button
              onClick={onClearCompleted}
              disabled={completedCount === 0}
              className="flex-shrink-0 rounded-lg bg-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Info className="h-4 w-4 text-blue-500" />
          About
        </h2>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Personal Goal Builder</p>
              <p className="text-xs text-slate-400">Version 1.0.0</p>
            </div>
          </div>
          <p className="px-1 text-xs leading-relaxed text-slate-400">
            A simple, focused tool for setting personal goals, breaking them into tasks, tracking your progress, and building consistent habits.
          </p>
          <p className="px-1 text-xs text-slate-300">
            Your data is stored securely and synced across devices.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">Tips</h2>
        <ul className="space-y-2.5 text-xs text-slate-500">
          <li className="flex gap-2">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600">1</span>
            Break large goals into smaller tasks to make progress feel achievable.
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600">2</span>
            Set deadlines on tasks to keep yourself accountable.
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600">3</span>
            Write a short reflection daily to build self-awareness.
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600">4</span>
            Complete at least one task per day to keep your streak alive.
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-slate-300">
        <Github className="h-3.5 w-3.5" />
        Built with focus and care
      </div>
    </div>
  );
}
