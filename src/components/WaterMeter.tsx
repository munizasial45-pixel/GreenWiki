import React from 'react';
import { Droplets } from 'lucide-react';

interface WaterMeterProps {
  need: 'Low' | 'Moderate' | 'High';
  summerSchedule?: string;
  showText?: boolean;
}

export function WaterMeter({ need, summerSchedule, showText = true }: WaterMeterProps) {
  const getDrops = () => {
    switch (need) {
      case 'High': return 3;
      case 'Moderate': return 2;
      case 'Low': return 1;
      default: return 2;
    }
  };

  const dropsCount = getDrops();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" title={`Water Requirement: ${need}`}>
        {[1, 2, 3].map((drop) => (
          <Droplets
            key={drop}
            className={`w-3.5 h-3.5 transition-colors ${
              drop <= dropsCount
                ? 'text-sky-500 fill-sky-500'
                : 'text-stone-300 dark:text-forest-900'
            }`}
          />
        ))}
      </div>
      {showText && (
        <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
          {summerSchedule ? summerSchedule.split(',')[0] : `${need} water`}
        </span>
      )}
    </div>
  );
}
