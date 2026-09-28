import { useCallback, useEffect, useState } from 'react';
import type { Goal, GoalCategory } from '@/types';
import { supabase } from '@/lib/supabase';
import { rowToGoal, goalToInsert } from '@/lib/mappers';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }
    setGoals((data as unknown[]).map((row) => rowToGoal(row as never)));
    setError(null);
  }, []);

  useEffect(() => {
    (async () => {
      await fetchGoals();
      setLoaded(true);
    })();
  }, [fetchGoals]);

  const addGoal = useCallback(
    async (text: string, category: GoalCategory, targetDate: string) => {
      const { data, error } = await supabase
        .from('goals')
        .insert(goalToInsert({ text, category, targetDate }))
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

  const toggleGoal = useCallback(async (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    const { error } = await supabase
      .from('goals')
      .update({ completed: !goal.completed })
      .eq('id', id);
    if (error) setError(error.message);
  }, [goals]);

  const deleteGoal = useCallback(async (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) setError(error.message);
  }, []);

  const clearCompleted = useCallback(async () => {
    const completedIds = goals.filter((g) => g.completed).map((g) => g.id);
    if (completedIds.length === 0) return;
    setGoals((prev) => prev.filter((g) => !g.completed));
    const { error } = await supabase
      .from('goals')
      .delete()
      .in('id', completedIds);
    if (error) setError(error.message);
  }, [goals]);

  return { goals, addGoal, toggleGoal, deleteGoal, clearCompleted, loaded, error };
}
