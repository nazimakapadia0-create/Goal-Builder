import { useState, useMemo } from 'react';
import { Flame, TrendingUp, BookHeart, Trash2, Send } from 'lucide-react';
import type { Goal, Task, Reflection, StreakDay, Mood } from '@/types';
import { CATEGORIES, CATEGORY_STYLES, MOODS, MOOD_STYLES } from '@/types';
import { goalProgress, ProgressBar } from '@/components/ui';
import { EmptyState } from '@/components/GoalDetail';
import { todayISO, formatRelative, formatDate } from '@/lib/date';

interface ProgressProps {
  goals: Goal[];
  tasks: Task[];
  reflections: Reflection[];
  streakDays: StreakDay[];
  onAddReflection: (goalId: string | null, content: string, mood: Mood | null) => void;
  onDeleteReflection: (id: string) => void;
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

function buildLast7Days(streakDays: StreakDay[]): { date: string; label: string; count: number }[] {
  const days: { date: string; label: string; count: number }[] = [];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const entry = streakDays.find((s) => s.date === dateStr);
    days.push({
      date: dateStr,
      label: dayLabels[d.getDay()],
      count: entry?.completedCount ?? 0,
    });
  }
  return days;
}

export function Progress({
  goals,
  tasks,
  reflections,
  streakDays,
  onAddReflection,
  onDeleteReflection,
}: ProgressProps) {
  const [refContent, setRefContent] = useState('');
  const [refMood, setRefMood] = useState<Mood | null>(null);
  const [refGoalId, setRefGoalId] = useState<string>('');

  const streak = calcStreak(streakDays);
  const last7 = buildLast7Days(streakDays);
  const maxCount = Math.max(...last7.map((d) => d.count), 1);

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  const categoryStats = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const catGoals = goals.filter((g) => g.category === cat);
      const done = catGoals.filter((g) => g.completed).length;
      return {
        category: cat,
        total: catGoals.length,
        done,
        pct: catGoals.length > 0 ? Math.round((done / catGoals.length) * 100) : 0,
      };
    });
  }, [goals]);

  function handleAddReflection(e: React.FormEvent) {
    e.preventDefault();
    if (!refContent.trim()) return;
    onAddReflection(refGoalId || null, refContent, refMood);
    setRefContent('');
    setRefMood(null);
    setRefGoalId('');
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">Progress</h1>
        <p className="mt-0.5 text-xs text-slate-400">Track your consistency and reflect on your journey</p>
      </div>

      {/* Streak card */}
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-white shadow-md shadow-orange-200">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
          <Flame className="h-6 w-6" />
        </div>
        <div>
          <p className="text-3xl font-bold leading-none">{streak}</p>
          <p className="mt-1 text-xs text-orange-100">
            {streak === 0 ? 'Start your streak today' : `Day ${streak} streak — keep going!`}
          </p>
        </div>
      </div>

      {/* Last 7 days chart */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          Last 7 Days
        </h2>
        <div className="flex items-end justify-between gap-2">
          {last7.map((day) => (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-24 w-full items-end justify-center">
                <div
                  className="w-full max-w-[28px] rounded-t-md transition-all duration-500"
                  style={{
                    height: `${Math.max(day.count > 0 ? 8 : 2, (day.count / maxCount) * 100)}%`,
                    backgroundColor: day.count > 0 ? '#2563eb' : '#e2e8f0',
                  }}
                  title={`${day.count} completed`}
                />
              </div>
              <span className="text-[10px] font-medium text-slate-400">{day.label}</span>
              {day.count > 0 && <span className="text-[10px] font-bold text-blue-600">{day.count}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Active" value={activeGoals.length} />
        <MiniStat label="Completed" value={completedGoals.length} />
        <MiniStat label="Tasks Done" value={`${completedTasks}/${totalTasks}`} />
        <MiniStat label="Reflections" value={reflections.length} />
      </div>

      {/* Category breakdown */}
      {goals.length > 0 && (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">By Category</h2>
          <div className="space-y-4">
            {categoryStats.map((stat) => {
              const style = CATEGORY_STYLES[stat.category];
              return (
                <div key={stat.category}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                      {stat.category}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {stat.done}/{stat.total} · {stat.pct}%
                    </span>
                  </div>
                  <ProgressBar value={stat.pct} gradient={style.gradient} size="sm" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Goal progress list */}
      {activeGoals.length > 0 && (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Goal Progress</h2>
          <div className="space-y-3">
            {activeGoals.map((goal) => {
              const progress = goalProgress(goal, tasks);
              const style = CATEGORY_STYLES[goal.category];
              return (
                <div key={goal.id}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-medium text-slate-700">{goal.text}</span>
                    <span className="flex-shrink-0 text-xs font-bold text-slate-600">{progress}%</span>
                  </div>
                  <ProgressBar value={progress} gradient={style.gradient} size="sm" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reflection section */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <BookHeart className="h-4 w-4 text-violet-500" />
          Reflection
        </h2>

        <form onSubmit={handleAddReflection} className="space-y-3">
          <textarea
            value={refContent}
            onChange={(e) => setRefContent(e.target.value)}
            placeholder="What did you learn today? What went well? What could be better?"
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
          />

          <div className="flex flex-wrap items-center gap-2">
            {MOODS.map((mood) => {
              const mStyle = MOOD_STYLES[mood];
              const isActive = refMood === mood;
              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setRefMood(isActive ? null : mood)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                    isActive ? `${mStyle.bg} ${mStyle.text} ring-2 ring-current ring-opacity-20` : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <span>{mStyle.emoji}</span>
                  {mStyle.label}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            {goals.length > 0 && (
              <select
                value={refGoalId}
                onChange={(e) => setRefGoalId(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              >
                <option value="">General reflection</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.text.slice(0, 40)}
                  </option>
                ))}
              </select>
            )}
            <button
              type="submit"
              disabled={!refContent.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              Save
            </button>
          </div>
        </form>

        {reflections.length > 0 && (
          <div className="mt-4 space-y-3 border-t border-slate-50 pt-4">
            {reflections.slice(0, 10).map((ref) => {
              const goal = ref.goalId ? goals.find((g) => g.id === ref.goalId) : null;
              const mStyle = ref.mood ? MOOD_STYLES[ref.mood] : null;
              return (
                <div key={ref.id} className="group rounded-xl bg-slate-50 p-3">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {mStyle && (
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${mStyle.bg} ${mStyle.text}`}>
                          {mStyle.emoji} {mStyle.label}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{formatRelative(ref.createdAt)}</span>
                    </div>
                    <button
                      onClick={() => onDeleteReflection(ref.id)}
                      className="text-slate-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">{ref.content}</p>
                  {goal && (
                    <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                      on &ldquo;{goal.text}&rdquo;
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {goals.length === 0 && reflections.length === 0 && (
        <EmptyState
          icon={BookHeart}
          title="No progress to show yet"
          message="Create goals and complete tasks to see your progress here"
        />
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-100">
      <p className="text-lg font-bold text-slate-800">{value}</p>
      <p className="text-[10px] text-slate-400">{label}</p>
    </div>
  );
}
