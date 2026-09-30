import { useCallback, useEffect, useState } from 'react';
import type { Goal, GoalCategory, Priority, Task, Reflection, StreakDay, Mood } from '@/types';
import { supabase, supabaseInitError } from '@/lib/supabase';
import {
  rowToGoal,
  rowToTask,
  rowToReflection,
  rowToStreakDay,
  goalToInsert,
  taskToInsert,
  reflectionToInsert,
} from '@/lib/mappers';
import { todayISO } from '@/lib/date';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [streakDays, setStreakDays] = useState<StreakDay[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(supabaseInitError);

  const fetchAll = useCallback(async () => {
    if (!supabase) return;
    const [goalsRes, tasksRes, reflectionsRes, streakRes] = await Promise.all([
      supabase.from('goals').select('*').order('created_at', { ascending: false }),
      supabase.from('tasks').select('*').order('order_index', { ascending: true }),
      supabase.from('reflections').select('*').order('created_at', { ascending: false }),
      supabase.from('streak_log').select('*').order('date', { ascending: false }),
    ]);

    if (goalsRes.error) {
      setError(goalsRes.error.message);
      return;
    }
    setGoals((goalsRes.data as unknown[]).map((r) => rowToGoal(r as never)));
    if (!tasksRes.error) setTasks((tasksRes.data as unknown[]).map((r) => rowToTask(r as never)));
    if (!reflectionsRes.error) setReflections((reflectionsRes.data as unknown[]).map((r) => rowToReflection(r as never)));
    if (!streakRes.error) setStreakDays((streakRes.data as unknown[]).map((r) => rowToStreakDay(r as never)));
    setError(null);
  }, []);

  useEffect(() => {
    (async () => {
      await fetchAll();
      setLoaded(true);
    })();
  }, [fetchAll]);

  function logStreakActivity() {
    if (!supabase) return;
    const today = todayISO();
    (async () => {
      const { data } = await supabase.from('streak_log').select('*').eq('date', today).maybeSingle();
      if (data) {
        await supabase
          .from('streak_log')
          .update({ completed_count: (data as never as { completed_count: number }).completed_count + 1 })
          .eq('date', today);
      } else {
        await supabase.from('streak_log').insert({ date: today, completed_count: 1 });
      }
      const res = await supabase.from('streak_log').select('*').order('date', { ascending: false });
      if (!res.error) setStreakDays((res.data as unknown[]).map((r) => rowToStreakDay(r as never)));
    })();
  }

  const addGoal = useCallback(
    async (text: string, category: GoalCategory, targetDate: string, priority: Priority, reason: string) => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('goals')
        .insert(goalToInsert({ text, category, targetDate, priority, reason }))
        .select()
        .single();
      if (error) {
        setError(error.message);
        return;
      }
      setGoals((prev) => [rowToGoal(data as never), ...prev]);
    },
    []
  );

  const toggleGoal = useCallback(
    async (id: string) => {
      if (!supabase) return;
      const goal = goals.find((g) => g.id === id);
      if (!goal) return;
      const newVal = !goal.completed;
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, completed: newVal } : g)));
      const { error } = await supabase.from('goals').update({ completed: newVal }).eq('id', id);
      if (error) {
        setError(error.message);
        return;
      }
      if (newVal) logStreakActivity();
    },
    [goals]
  );

  const deleteGoal = useCallback(async (id: string) => {
    if (!supabase) return;
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setTasks((prev) => prev.filter((t) => t.goalId !== id));
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) setError(error.message);
  }, []);

  const clearCompleted = useCallback(async () => {
    if (!supabase) return;
    const completedIds = goals.filter((g) => g.completed).map((g) => g.id);
    if (completedIds.length === 0) return;
    setGoals((prev) => prev.filter((g) => !g.completed));
    setTasks((prev) => prev.filter((t) => !completedIds.includes(t.goalId)));
    const { error } = await supabase.from('goals').delete().in('id', completedIds);
    if (error) setError(error.message);
  }, [goals]);

  const addTask = useCallback(async (goalId: string, title: string, dueDate: string) => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskToInsert({ goalId, title, dueDate }))
      .select()
      .single();
    if (error) {
      setError(error.message);
      return;
    }
    setTasks((prev) => [...prev, rowToTask(data as never)]);
  }, []);

  const toggleTask = useCallback(
    async (id: string) => {
      if (!supabase) return;
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const newVal = !task.completed;
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: newVal } : t)));
      const { error } = await supabase.from('tasks').update({ completed: newVal }).eq('id', id);
      if (error) {
        setError(error.message);
        return;
      }
      if (newVal) logStreakActivity();
    },
    [tasks]
  );

  const deleteTask = useCallback(async (id: string) => {
    if (!supabase) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) setError(error.message);
  }, []);

  const addReflection = useCallback(
    async (goalId: string | null, content: string, mood: Mood | null) => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('reflections')
        .insert(reflectionToInsert({ goalId, content, mood }))
        .select()
        .single();
      if (error) {
        setError(error.message);
        return;
      }
      setReflections((prev) => [rowToReflection(data as never), ...prev]);
    },
    []
  );

  const deleteReflection = useCallback(async (id: string) => {
    if (!supabase) return;
    setReflections((prev) => prev.filter((r) => r.id !== id));
    const { error } = await supabase.from('reflections').delete().eq('id', id);
    if (error) setError(error.message);
  }, []);

  return {
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
    loaded,
    error,
  };
}
