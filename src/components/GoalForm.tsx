import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import type { GoalCategory } from '@/types';
import { CATEGORIES, CATEGORY_STYLES } from '@/types';

interface GoalFormProps {
  onAdd: (text: string, category: GoalCategory, targetDate: string) => void;
}

export function GoalForm({ onAdd }: GoalFormProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Learning');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter a goal');
      return;
    }
    onAdd(text, category, targetDate);
    setText('');
    setTargetDate('');
    setError('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50 ring-1 ring-slate-100"
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Create a New Goal</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="goal-text" className="mb-1.5 block text-sm font-medium text-slate-600">
            What do you want to achieve?
          </label>
          <input
            id="goal-text"
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g., Read 12 books this year"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="goal-category" className="mb-1.5 block text-sm font-medium text-slate-600">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = category === cat;
                const style = CATEGORY_STYLES[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? `${style.bg} ${style.text} ring-2 ${style.ring}`
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${isActive ? style.dot : 'bg-slate-300'}`} />
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="goal-date" className="mb-1.5 block text-sm font-medium text-slate-600">
              Target Date
            </label>
            <input
              id="goal-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add Goal
        </button>
      </div>
    </form>
  );
}
