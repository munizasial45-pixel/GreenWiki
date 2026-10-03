import React from 'react';

export function PlantCardSkeleton() {
  return (
    <div className="bg-white dark:bg-forest-900/40 rounded-3xl border border-forest-900/10 dark:border-forest-800/40 overflow-hidden shadow-soft animate-pulse flex flex-col h-full">
      <div className="aspect-[4/3] w-full bg-stone-200 dark:bg-forest-800/50" />
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-2">
          <div className="h-5 bg-stone-200 dark:bg-forest-800/60 rounded-md w-3/4" />
          <div className="h-3 bg-stone-100 dark:bg-forest-800/40 rounded-md w-1/2" />
          <div className="h-10 bg-stone-100 dark:bg-forest-800/30 rounded-md w-full mt-2" />
        </div>
        <div className="pt-3 border-t border-forest-900/10 dark:border-forest-800/40 grid grid-cols-2 gap-2">
          <div className="h-3.5 bg-stone-200 dark:bg-forest-800/50 rounded" />
          <div className="h-3.5 bg-stone-200 dark:bg-forest-800/50 rounded" />
        </div>
      </div>
    </div>
  );
}
