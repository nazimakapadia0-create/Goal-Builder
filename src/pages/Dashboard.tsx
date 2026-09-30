import { Target, CheckCircle2, Calendar, Flame, TrendingUp, ArrowRight } from 'lucide-react';
import type { Goal, Task, StreakDay, PageId } from '@/types';
import { CATEGORY_STYLES } from '@/types';
import { goalProgress, ProgressBar, CategoryBadge, DeadlineBadge } from '@/components/ui';
import { formatGreeting, weekdayName, dateSuffix, daysUntil, isOverdue, todayISO } from '@/lib/date';

interface DashboardProps {
  goals: Goal[];
  tasks: Task[];
  streakDays: StreakDay[];
  onNavigate: (page: PageId) => void;
}

function calcStreak(streakDays: StreakDay[]): number {
  if (streakDays.length === 0) return 0;
  const sorted = [...streakDays].sort((a, b) => b.date.localeCompare(a.date));
  const today = todayISO();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (sorted[0].date !== today && sorted[0].date !== yesterdayStr) return 0;

  let streak = 0;
  let checkDate = sorted[0].date === today ? new Date() : new Date(yesterday);

  for (const day of sorted) {
    const dayStr = checkDate.toISOString().slice(0, 10);
    if (day.date === dayStr) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (day.date < dayStr) {
      break;
    }
  }
  return streak;
}

export function Dashboard({ goals, tasks, streakDays, onNavigate }: DashboardProps) {
  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);
  const overallPct = goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0;
  const streak = calcStreak(streakDays);
  const today = todayISO();
  const todayTasks = tasks.filter((t) => t.dueDate === today && !t.completed);
  const upcomingDeadlines = activeGoals
    .filter((g) => g.targetDate)
    .sort((a, b) => a.targetDate.localeCompare(b.targetDate))
    .slice(0, 3);

  const highPriorityGoals = activeGoals.filter((g) => g.priority === 'high').slice(0, 3);

  return (
    <div className="animate-fade-in space-y-5">
      {/* Greeting */}
      <div>
        <p className="text-xs font-medium text-slate-400">{weekdayName()}, {dateSuffix()}</p>
        <h1 className="mt-0.5 text-xl font-bold text-slate-800 sm:text-2xl">{formatGreeting()}</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={Target}
          label="Active Goals"
          value={activeGoals.length}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={completedGoals.length}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={Flame}
          label="Day Streak"
          value={streak}
          color="bg-orange-50 text-orange-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Overall"
          value={`${overallPct}%`}
          color="bg-violet-50 text-violet-600"
        />
      </div>

      {/* Today's tasks preview */}
      {todayTasks.length > 0 && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Calendar className="h-4 w-4 text-blue-500" />
              Today's Tasks
            </h2>
            <button
              onClick={() => onNavigate('today')}
              className="flex items-center gap-0.5 text-xs font-medium text-blue-600 transition hover:text-blue-700"
            >
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2">
            {todayTasks.slice(0, 3).map((task) => {
              const goal = goals.find((g) => g.id === task.goalId);
              return (
                <div key={task.id} className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2">
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                  <span className="flex-1 text-xs font-medium text-slate-700">{task.title}</span>
                  {goal && <CategoryBadge category={goal.category} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* High priority goals */}
      {highPriorityGoals.length > 0 && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <h2 className="mb-3 text-sm font-semibold text-slate-800">High Priority</h2>
          <div className="space-y-3">
            {highPriorityGoals.map((goal) => {
              const progress = goalProgress(goal, tasks);
              const style = CATEGORY_STYLES[goal.category];
              return (
                <button
                  key={goal.id}
                  onClick={() => onNavigate('goals')}
                  className="w-full text-left"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-medium text-slate-700">{goal.text}</span>
                    <DeadlineBadge date={goal.targetDate} completed={goal.completed} />
                  </div>
                  <ProgressBar value={progress} gradient={style.gradient} size="sm" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <h2 className="mb-3 text-sm font-semibold text-slate-800">Upcoming Deadlines</h2>
          <div className="space-y-2">
            {upcomingDeadlines.map((goal) => {
              const days = daysUntil(goal.targetDate);
              return (
                <button
                  key={goal.id}
                  onClick={() => onNavigate('goals')}
                  className="flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5 text-left transition hover:bg-slate-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`h-2 w-2 flex-shrink-0 rounded-full ${CATEGORY_STYLES[goal.category].dot}`} />
                    <span className="truncate text-xs font-medium text-slate-700">{goal.text}</span>
                  </div>
                  <span className={`flex-shrink-0 text-xs font-medium ${days !== null && days <= 3 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {days === 0 ? 'Today' : days === 1 ? '1 day' : `${days} days`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
          <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Target className="h-7 w-7 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-600">Welcome to Goal Builder</h3>
          <p className="mt-1 mb-4 text-sm text-slate-400">Start by creating your first goal</p>
          <button
            onClick={() => onNavigate('goals')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Target className="h-4 w-4" />
            Create a Goal
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Target;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}
