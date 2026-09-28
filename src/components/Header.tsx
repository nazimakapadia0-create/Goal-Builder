import { Target } from 'lucide-react';

export function Header() {
  return (
    <header className="text-center">
      <div className="mb-4 inline-flex items-center gap-2.5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-200">
          <Target className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Personal Goal Builder
        </h1>
      </div>
      <p className="mx-auto max-w-md text-sm text-slate-500">
        Define what matters, track your progress, and turn aspirations into achievements.
      </p>
    </header>
  );
}
