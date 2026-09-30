import { CalendarCheck, Check, Flame, Sunrise } from 'lucide-react';
import type { Goal, Task, StreakDay } from '@/types';
import { CATEGORY_STYLES } from '@/types';
import { EmptyState } from '@/components/GoalDetail';
import { todayISO, formatDate } from '@/lib/date';

interface TodayProps {
  goals: Goal[];
  tasks: Task[];
  streakDays: StreakDay[];
  onToggleTask: (id: string) => void;
  onToggleGoal: (id: string) => void;
}

export function Today({ goals, tasks, streakDays, onToggleTask, onToggleGoal }: TodayProps) {
  const today = todayISO();
  const todayTasks = tasks.filter((t) => t.dueDate === today);
  const overdueTasks = tasks.filter((t) => t.dueDate && t.dueDate < today && !t.completed);
  const todayGoalDeadlines = goals.filter((g) => g.targetDate === today && !g.completed);
  const noDateActiveTasks = tasks.filter((t) => !t.dueDate && !t.completed);

  const allTodayItems = [
    ...todayTasks.map((t) => ({ type: 'task' as const, ...t })),
    ...overdueTasks.map((t) => ({ type: 'overdue' as const, ...t })),
  ];

  const completedToday = todayTasks.filter((t) => t.completed).length;
  const todayStreak = streakDays.find((s) => s.date === today);
  const todayCount = todayStreak?.completedCount ?? 0;

  const goalMap = new Map(goals.map((g) => [g.id, g]));

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">Today</h1>
        <p className="mt-0.5 text-xs text-slate-400">{formatDate(today)}</p>
      </div>

      {/* Streak banner */}
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white shadow-md shadow-orange-200">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
          <Flame className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold leading-none">{todayCount}</p>
          <p className="mt-0.5 text-xs text-orange-100">
            {todayCount === 0 ? 'Complete a task to start your streak' : 'Things completed today'}
          </p>
        </div>
        {completedToday > 0 && (
          <div className="flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1">
            <Check className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{completedToday} done</span>
          </div>
        )}
      </div>

      {/* Goals due today */}
      {todayGoalDeadlines.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-700">Goals Due Today</h2>
          <div className="space-y-2">
            {todayGoalDeadlines.map((goal) => {
              const style = CATEGORY_STYLES[goal.category];
              return (
                <div
                  key={goal.id}
                  className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-amber-100"
                >
                  <button
                    onClick={() => onToggleGoal(goal.id)}
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 border-slate-300 bg-white transition hover:border-blue-400"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{goal.text}</p>
                    <span className={`text-xs ${style.text}`}>{goal.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tasks due today + overdue */}
      {allTodayItems.length > 0 ? (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-700">
            {allTodayItems.length} Task{allTodayItems.length !== 1 ? 's' : ''}
          </h2>
          <div className="space-y-2">
            {allTodayItems.map((item) => {
              const goal = goalMap.get(item.goalId);
              const style = goal ? CATEGORY_STYLES[goal.category] : null;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 transition-all ${
                    item.type === 'overdue' ? 'ring-red-100' : 'ring-slate-100'
                  } ${item.completed ? 'opacity-60' : ''}`}
                >
                  <button
                    onClick={() => onToggleTask(item.id)}
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                      item.completed ? 'animate-check-pop border-blue-600 bg-blue-600' : 'border-slate-300 bg-white hover:border-blue-400'
                    }`}
                  >
                    {item.completed && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${item.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {item.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      {goal && style && (
                        <span className={`text-xs ${style.text}`}>{goal.text}</span>
                      )}
                      {item.type === 'overdue' && (
                        <span className="text-xs font-medium text-red-500">Overdue</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        (todayGoalDeadlines.length === 0) && (
          <EmptyState
            icon={Sunrise}
            title="Nothing scheduled for today"
            message="Add tasks with today's date to your goals, or enjoy a well-earned break"
          />
        )
      )}

      {/* Tasks without dates */}
      {noDateActiveTasks.length > 0 && allTodayItems.length === 0 && todayGoalDeadlines.length === 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-700">Unscheduled Tasks</h2>
          <div className="space-y-2">
            {noDateActiveTasks.slice(0, 5).map((task) => {
              const goal = goalMap.get(task.goalId);
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"
                >
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 border-slate-300 bg-white transition hover:border-blue-400"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{task.title}</p>
                    {goal && <span className="text-xs text-slate-400">{goal.text}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
