import React from 'react';
import { MONTH_SHORT_NAMES, MONTH_NAMES } from '../lib/plants';
import { Calendar } from 'lucide-react';

interface SeasonCalendarBarProps {
  bestMonths: number[]; // 1 to 12
  bloomOrHarvest?: string;
  notes?: string;
  compact?: boolean;
}

export function SeasonCalendarBar({
  bestMonths,
  bloomOrHarvest,
  notes,
  compact = false,
}: SeasonCalendarBarProps) {
  const currentMonth = new Date().getMonth() + 1; // 1-12

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Month Bar */}
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 sm:gap-1">
        {MONTH_SHORT_NAMES.map((shortName, idx) => {
          const monthNum = idx + 1;
          const isOptimal = bestMonths.includes(monthNum);
          const isCurrent = currentMonth === monthNum;

          return (
            <div
              key={shortName}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all ${
                isOptimal
                  ? 'bg-sprout-500 dark:bg-sprout-600 text-forest-950 dark:text-white font-bold shadow-sm shadow-sprout-500/20'
                  : 'bg-stone-100 dark:bg-forest-900/40 text-stone-500 dark:text-stone-300'
              } ${isCurrent ? 'ring-2 ring-forest-700 dark:ring-sprout-300 ring-offset-1 dark:ring-offset-forest-950 font-black' : ''}`}
              title={`${MONTH_NAMES[idx]}: ${isOptimal ? 'Optimal Planting & Growing' : 'Dormancy or Maintenance'}${isCurrent ? ' (Current Month)' : ''}`}
            >
              <span className="text-[11px] sm:text-xs font-semibold">{shortName}</span>
              {isOptimal && (
                <span className="w-1.5 h-1.5 rounded-full bg-forest-950 dark:bg-white mt-0.5" />
              )}
              {isCurrent && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!compact && (
        <div className="flex flex-wrap items-center justify-between text-xs text-stone-600 dark:text-stone-300 gap-2 pt-1 border-t border-forest-900/10 dark:border-forest-800/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sprout-500 inline-block" />
              <span className="font-medium">Best Planting / Sowing Months</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Current Month</span>
            </div>
          </div>
          {bloomOrHarvest && (
            <div className="flex items-center gap-1.5 font-medium text-forest-800 dark:text-sprout-300">
              <Calendar className="w-3.5 h-3.5 text-sprout-600 dark:text-sprout-400" />
              <span>{bloomOrHarvest}</span>
            </div>
          )}
        </div>
      )}

      {notes && !compact && (
        <p className="text-xs text-stone-700 dark:text-stone-300 bg-forest-50/60 dark:bg-forest-900/30 p-2.5 rounded-xl border border-forest-100 dark:border-forest-800/60 leading-relaxed">
          <strong className="text-forest-800 dark:text-sprout-300">Seasonal note: </strong>
          {notes}
        </p>
      )}
    </div>
  );
}
