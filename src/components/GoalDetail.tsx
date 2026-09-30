import { useState } from 'react';
import { Plus, Check, Trash2, ChevronDown, ChevronRight, ListTodo } from 'lucide-react';
import type { Goal, Task } from '@/types';
import { CATEGORY_STYLES, PRIORITY_STYLES } from '@/types';
import { formatDate, daysUntil, isOverdue } from '@/lib/date';
import { goalProgress, ProgressBar, CategoryBadge, DeadlineBadge } from './ui';

interface GoalDetailProps {
  goal: Goal;
  tasks: Task[];
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
  onAddTask: (goalId: string, title: string, dueDate: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function GoalDetail({
  goal,
  tasks,
  onToggleGoal,
  onDeleteGoal,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: GoalDetailProps) {
  const [expanded, setExpanded] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);

  const goalTasks = tasks.filter((t) => t.goalId === goal.id);
  const progress = goalProgress(goal, tasks);
  const style = CATEGORY_STYLES[goal.category];
  const priorityStyle = PRIORITY_STYLES[goal.priority];
  const days = daysUntil(goal.targetDate);
  const overdue = !goal.completed && isOverdue(goal.targetDate);

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;
    onAddTask(goal.id, newTask, taskDate);
    setNewTask('');
    setTaskDate('');
    setShowTaskInput(false);
  }

  return (
    <div
      className={`animate-slide-in overflow-hidden rounded-xl bg-white shadow-sm ring-1 transition-all hover:shadow-md ${
        goal.completed ? 'opacity-70 ring-slate-100' : overdue ? 'ring-red-100' : 'ring-slate-100'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleGoal(goal.id)}
            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
              goal.completed ? 'animate-check-pop border-blue-600 bg-blue-600' : 'border-slate-300 bg-white hover:border-blue-400'
            }`}
            aria-label={goal.completed ? 'Mark as not completed' : 'Mark as completed'}
          >
            {goal.completed && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
          </button>

          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium text-slate-800 ${goal.completed ? 'line-through decoration-slate-400' : ''}`}>
              {goal.text}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <CategoryBadge category={goal.category} />
              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
                {priorityStyle.label}
              </span>
              <DeadlineBadge date={goal.targetDate} completed={goal.completed} />
            </div>

            {goal.reason && (
              <p className="mt-2 text-xs italic text-slate-400">&ldquo;{goal.reason}&rdquo;</p>
            )}

            {goalTasks.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    {goalTasks.filter((t) => t.completed).length}/{goalTasks.length} tasks
                  </span>
                  <span className="text-xs font-bold text-slate-600">{progress}%</span>
                </div>
                <div className="mt-1.5">
                  <ProgressBar value={progress} gradient={style.gradient} size="sm" />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onDeleteGoal(goal.id)}
            className="flex-shrink-0 rounded-lg p-1.5 text-slate-300 transition-all hover:bg-red-50 hover:text-red-500"
            aria-label="Delete goal"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-slate-600"
          >
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            {goalTasks.length > 0 ? `${goalTasks.length} tasks` : 'Add tasks'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-50 px-4 pb-4 pt-3">
          <div className="space-y-2">
            {goalTasks.map((task) => {
              const taskOverdue = !task.completed && isOverdue(task.dueDate);
              return (
                <div key={task.id} className="flex items-start gap-2.5 rounded-lg bg-slate-50 px-3 py-2">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition-all ${
                      task.completed ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white hover:border-blue-400'
                    }`}
                  >
                    {task.completed && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <span className={`text-[10px] font-medium ${taskOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="flex-shrink-0 rounded p-0.5 text-slate-300 transition hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {showTaskInput ? (
            <form onSubmit={handleAddTask} className="mt-2.5 space-y-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Task description..."
                autoFocus
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowTaskInput(false)}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowTaskInput(true)}
              className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-blue-600 transition hover:text-blue-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add task
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon?: typeof ListTodo;
  title: string;
  message: string;
}

export function EmptyState({ icon: Icon = ListTodo, title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center shadow-sm ring-1 ring-slate-100">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
        <Icon className="h-7 w-7 text-slate-300" />
      </div>
      <h3 className="text-sm font-semibold text-slate-500">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-400">{message}</p>
    </div>
  );
}
