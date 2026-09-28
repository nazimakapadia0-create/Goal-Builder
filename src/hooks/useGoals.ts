import { useCallback, useEffect, useState } from 'react';
import type { Goal, GoalCategory } from '@/types';
import { loadGoals, saveGoals } from '@/lib/storage';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setGoals(loadGoals());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveGoals(goals);
  }, [goals, loaded]);

  const addGoal = useCallback(
    (text: string, category: GoalCategory, targetDate: string) => {
      const goal: Goal = {
        id: generateId(),
        text: text.trim(),
        category,
        targetDate,
        completed: false,
        createdAt: Date.now(),
      };
      setGoals((prev) => [goal, ...prev]);
    },
    []
  );

  const toggleGoal = useCallback((id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setGoals((prev) => prev.filter((g) => !g.completed));
  }, []);

  return { goals, addGoal, toggleGoal, deleteGoal, clearCompleted, loaded };
}
