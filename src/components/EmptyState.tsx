import React from 'react';
import { Sprout, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
  resetLabel?: string;
}

export function EmptyState({
  title = 'No plants found',
  message = 'Try adjusting your search terms or relaxing your filter requirements to discover more greenery.',
  onReset,
  resetLabel = 'Reset All Filters',
}: EmptyStateProps) {
  return (
    <div className="w-full py-16 px-4 text-center flex flex-col items-center justify-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-forest-100 dark:bg-forest-900 flex items-center justify-center text-forest-600 dark:text-sprout-400 mb-4 shadow-soft">
        <Sprout className="w-8 h-8 opacity-80" />
      </div>
      <h3 className="font-serif text-xl font-bold text-forest-950 dark:text-cream-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
        {message}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-sm font-semibold shadow-soft hover:shadow-card transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          {resetLabel}
        </button>
      )}
    </div>
  );
}
