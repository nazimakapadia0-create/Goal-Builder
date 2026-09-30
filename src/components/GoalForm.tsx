import { useState } from 'react';
import { Plus, Sparkles, Flag } from 'lucide-react';
import type { GoalCategory, Priority } from '@/types';
import { CATEGORIES, CATEGORY_STYLES, PRIORITIES, PRIORITY_STYLES } from '@/types';

interface GoalFormProps {
  onAdd: (text: string, category: GoalCategory, targetDate: string, priority: Priority, reason: string) => void;
}

export function GoalForm({ onAdd }: GoalFormProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Learning');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter a goal name');
      return;
    }
    onAdd(text, category, targetDate, priority, reason);
    setText('');
    setTargetDate('');
    setReason('');
    setError('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6"
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-base font-semibold text-slate-800">Create a New Goal</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="goal-text" className="mb-1.5 block text-xs font-medium text-slate-600">
            Goal Name
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

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">Category</label>
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
                    isActive ? `${style.bg} ${style.text} ring-2 ${style.ring}` : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${isActive ? style.dot : 'bg-slate-300'}`} />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="goal-date" className="mb-1.5 block text-xs font-medium text-slate-600">
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

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => {
                const isActive = priority === p;
                const style = PRIORITY_STYLES[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      isActive ? `${style.bg} ${style.text} ${style.border}` : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <Flag className={`h-3 w-3 ${isActive ? style.icon : 'text-slate-300'}`} />
                    {style.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="goal-reason" className="mb-1.5 block text-xs font-medium text-slate-600">
            Why does this matter to you? <span className="text-slate-300">(optional)</span>
          </label>
          <textarea
            id="goal-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Your motivation will keep you going when it gets tough..."
            rows={2}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
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
