'use client';

import React, { useState, useRef, useEffect, useMemo, useId } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ComboBoxOption {
  value: string;
  label: string;
  sublabel?: string;
  group?: string;
}

interface ComboBoxProps {
  options: ComboBoxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  /** If true renders a compact trigger suitable for inline use */
  compact?: boolean;
}

export const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  disabled = false,
  className,
  compact = false,
}) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find(o => o.value === value) ?? null;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q
      ? options.filter(o =>
          o.label.toLowerCase().includes(q) ||
          o.sublabel?.toLowerCase().includes(q) ||
          o.group?.toLowerCase().includes(q)
        )
      : options;
  }, [options, query]);

  // Group the filtered results
  const grouped = useMemo(() => {
    const map = new Map<string, ComboBoxOption[]>();
    for (const opt of filtered) {
      const g = opt.group ?? '';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(opt);
    }
    return map;
  }, [filtered]);

  const handleSelect = (opt: ComboBoxOption) => {
    onChange(opt.value);
    setOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); setQuery(''); }
    if (e.key === 'Enter' && filtered.length === 1) handleSelect(filtered[0]);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(prev => !prev)}
        className={cn(
          'w-full flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white text-left transition-all',
          'hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          compact ? 'px-3 py-2 text-sm' : 'px-3.5 py-2.5 text-sm',
          open && 'border-slate-900 ring-2 ring-slate-900'
        )}
      >
        <span className="flex-1 truncate">
          {selected ? (
            <span className="font-semibold text-slate-900">{selected.label}
              {selected.sublabel && (
                <span className="ml-1.5 font-normal text-slate-500 text-xs">{selected.sublabel}</span>
              )}
            </span>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150', open && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-[70] mt-1.5 w-full min-w-[220px] rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100"
          style={{ maxHeight: '320px' }}
        >
          {/* Search */}
          <div className="p-2 border-b border-slate-100 sticky top-0 bg-white z-10">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-8 py-1.5 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 placeholder:text-slate-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Options */}
          <ul
            ref={listRef}
            role="listbox"
            className="overflow-y-auto"
            style={{ maxHeight: '252px' }}
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-slate-400">
                No results for &quot;{query}&quot;
              </li>
            ) : (
              Array.from(grouped.entries()).map(([group, opts]) => (
                <React.Fragment key={group}>
                  {group && (
                    <li className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border-b border-slate-100 sticky top-0">
                      {group}
                    </li>
                  )}
                  {opts.map(opt => {
                    const isSelected = opt.value === value;
                    return (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(opt)}
                        className={cn(
                          'flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors text-sm',
                          isSelected
                            ? 'bg-slate-900 text-white'
                            : 'hover:bg-slate-50 text-slate-800'
                        )}
                      >
                        <span className="flex flex-col min-w-0">
                          <span className="font-semibold truncate">{opt.label}</span>
                          {opt.sublabel && (
                            <span className={cn('text-xs truncate', isSelected ? 'text-slate-300' : 'text-slate-400')}>
                              {opt.sublabel}
                            </span>
                          )}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" />}
                      </li>
                    );
                  })}
                </React.Fragment>
              ))
            )}
          </ul>

          {/* Count hint */}
          {options.length > 10 && (
            <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400 font-medium">
              {filtered.length} of {options.length} shown
            </div>
          )}
        </div>
      )}
    </div>
  );
};
