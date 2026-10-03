import React from 'react';
import { Sun } from 'lucide-react';

interface SunMeterProps {
  score: number; // 1 to 4
  label?: string;
  showText?: boolean;
}

export function SunMeter({ score, label, showText = true }: SunMeterProps) {
  const levels = [
    { level: 1, name: 'Low Light', desc: 'Indirect / Filtered (2-4 hrs)' },
    { level: 2, name: 'Partial Sun', desc: 'Medium / Morning Sun (3-5 hrs)' },
    { level: 3, name: 'Bright Indirect', desc: 'Bright Filtered (5-7 hrs)' },
    { level: 4, name: 'Full Sun', desc: 'Direct Unfiltered (6-8+ hrs)' },
  ];

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {showText && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-stone-600 dark:text-stone-300">Light Intensity</span>
          <span className="font-semibold text-amber-700 dark:text-amber-300">
            {label || levels[score - 1]?.name || 'Moderate'}
          </span>
        </div>
      )}
      <div className="grid grid-cols-4 gap-1.5" role="meter" aria-valuenow={score} aria-valuemin={1} aria-valuemax={4} aria-label="Sunlight requirement meter">
        {levels.map((item) => {
          const isActive = item.level <= score;
          return (
            <div
              key={item.level}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm shadow-amber-500/20'
                  : 'bg-stone-200 dark:bg-forest-900/60'
              }`}
              title={`${item.name}: ${item.desc}`}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[10px] text-stone-600 dark:text-stone-300 font-medium px-0.5">
        <span>Low</span>
        <span>Partial</span>
        <span>Bright</span>
        <span>Full Sun</span>
      </div>
    </div>
  );
}
