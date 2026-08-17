'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TogglePillOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface TogglePillsProps<T extends string = string> {
  options: TogglePillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4 | 5 | 6;
  size?: 'sm' | 'md';
}

export function TogglePills<T extends string = string>({
  options,
  value,
  onChange,
  columns = 3,
  size = 'sm',
}: TogglePillsProps<T>) {
  const colClass: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return (
    <div className={cn('grid gap-1.5', colClass[columns])}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl border font-bold transition-all cursor-pointer whitespace-nowrap overflow-hidden',
            size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm',
            value === opt.value
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
          )}
        >
          {opt.icon}
          <span className="truncate">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
