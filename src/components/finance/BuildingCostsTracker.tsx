'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Fuel,
  Droplets,
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  X,
  Check,
  Trash2,
  Building2,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { BuildingExpenseCategory } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EmptyState } from '../ui/EmptyState';
import { ComboBox } from '../ui/ComboBox';
import { TogglePills } from '../ui/TogglePills';
import { cn } from '@/lib/utils';

const HEADING = '#1B2559';

const CATEGORY_META: Record<BuildingExpenseCategory, { label: string; icon: typeof ShieldCheck; variant: 'blue' | 'emerald' | 'amber' | 'purple' | 'teal' | 'secondary' }> = {
  GUARD_SECURITY: { label: 'Guard / Security', icon: ShieldCheck, variant: 'blue' },
  CLEANING_STAFF: { label: 'Cleaning Staff', icon: Sparkles, variant: 'teal' },
  GENERATOR_FUEL: { label: 'Generator Fuel', icon: Fuel, variant: 'amber' },
  WATER_TANKER: { label: 'Water Tanker', icon: Droplets, variant: 'blue' },
  LIFT_MAINTENANCE: { label: 'Lift Maintenance', icon: ArrowUpDown, variant: 'purple' },
  OTHER: { label: 'Other', icon: MoreHorizontal, variant: 'secondary' }
};

// ─── Add Building Expense Modal ─────────────────────────────────────────────

const AddExpenseModal: React.FC<{ isOpen: boolean; onClose: () => void; properties: string[] }> = ({
  isOpen, onClose, properties
}) => {
  const { units, addBuildingExpense } = usePropMAK();

  const [propertyName, setPropertyName] = useState(properties[0] || '');
  const [category, setCategory] = useState<BuildingExpenseCategory>('GUARD_SECURITY');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [monthPeriod, setMonthPeriod] = useState('August 2026');
  const [paidStatus, setPaidStatus] = useState<'PAID' | 'PENDING'>('PENDING');

  if (!isOpen) return null;

  const unitsSharing = units.filter(u => u.propertyName === propertyName).length || 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyName || !description || amount <= 0) return;

    addBuildingExpense({
      propertyName,
      category,
      description,
      amount,
      monthPeriod,
      paidStatus,
      unitsSharing,
      paidDate: paidStatus === 'PAID' ? new Date().toISOString().split('T')[0] : undefined
    });
    onClose();
    setDescription('');
    setAmount(0);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in text-slate-800">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

        <div className="p-5 flex items-center justify-between" style={{ background: '#EEF1FA' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight" style={{ color: HEADING }}>Log Building Running Cost</h3>
              <p className="text-xs text-slate-500">Guard, cleaner, generator fuel, water tanker, lift AMC</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">

          <div>
            <label className="block text-slate-700 font-bold mb-1">Building / Property *</label>
            <ComboBox
              options={properties.map(p => ({ value: p, label: p, sublabel: `${units.filter(u => u.propertyName === p).length} units` }))}
              value={propertyName}
              onChange={setPropertyName}
              placeholder="Select a building…"
              searchPlaceholder="Search property…"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Cost Category *</label>
            <TogglePills
              options={[
                { value: 'GUARD_SECURITY', label: 'Guard / Security' },
                { value: 'CLEANING_STAFF', label: 'Cleaning Staff' },
                { value: 'GENERATOR_FUEL', label: 'Generator Fuel' },
                { value: 'WATER_TANKER', label: 'Water Tanker' },
                { value: 'LIFT_MAINTENANCE', label: 'Lift Maintenance' },
                { value: 'OTHER', label: 'Other' }
              ]}
              value={category}
              onChange={val => setCategory(val as BuildingExpenseCategory)}
              columns={2}
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Description *</label>
            <Input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Security guard salaries — 3 shifts"
              className="bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Amount (Rs.) *</label>
              <Input
                type="number"
                required
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="e.g. 96000"
                className="bg-white font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Month</label>
              <Input
                type="text"
                value={monthPeriod}
                onChange={(e) => setMonthPeriod(e.target.value)}
                placeholder="e.g. August 2026"
                className="bg-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: '#EEF1FA' }}>
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              Split across units:
            </span>
            <span className="font-bold" style={{ color: HEADING }}>
              {unitsSharing} units · Rs. {amount > 0 ? Math.round(amount / unitsSharing).toLocaleString() : 0} / unit
            </span>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Payment Status</label>
            <TogglePills
              options={[
                { value: 'PENDING', label: 'Pending' },
                { value: 'PAID', label: 'Paid' }
              ]}
              value={paidStatus}
              onChange={val => setPaidStatus(val as 'PAID' | 'PENDING')}
              columns={2}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose} className="bg-white">Cancel</Button>
            <Button type="submit" variant="default">
              <Check className="w-4 h-4 mr-1" />
              <span>Save Cost Entry</span>
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const BuildingCostsTracker: React.FC = () => {
  const { buildingExpenses, units, markExpensePaid, deleteBuildingExpense } = usePropMAK();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [propertyFilter, setPropertyFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  const properties = useMemo(() => Array.from(new Set(units.map(u => u.propertyName))).sort(), [units]);

  const filtered = useMemo(() => buildingExpenses.filter(e => {
    if (categoryFilter !== 'ALL' && e.category !== categoryFilter) return false;
    if (propertyFilter !== 'ALL' && e.propertyName !== propertyFilter) return false;
    return true;
  }), [buildingExpenses, categoryFilter, propertyFilter]);

  const selectedExpense = filtered.find(e => e.id === selectedExpenseId) || filtered[0] || null;

  const stats = useMemo(() => {
    const pending = buildingExpenses.filter(e => e.paidStatus === 'PENDING');
    const paid = buildingExpenses.filter(e => e.paidStatus === 'PAID');
    return {
      pendingCount: pending.length,
      pendingAmount: pending.reduce((s, e) => s + e.amount, 0),
      paidAmount: paid.reduce((s, e) => s + e.amount, 0),
      totalAmount: buildingExpenses.reduce((s, e) => s + e.amount, 0)
    };
  }, [buildingExpenses]);

  return (
    <div className="space-y-6 text-slate-900 text-sm animate-in fade-in">

      {/* Top Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: HEADING }}>
                Building Operating Costs (CAM)
              </h1>
              <Badge variant="secondary">{buildingExpenses.length} Records</Badge>
              {stats.pendingCount > 0 && (
                <Badge variant="amber">{stats.pendingCount} Pending</Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Guard & cleaner salaries, generator fuel, water tanker, lift maintenance — recurring building-wide costs split across units
            </p>
          </div>

          <Button variant="default" onClick={() => setIsAddModalOpen(true)} className="font-bold text-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Log Running Cost</span>
          </Button>
        </div>
      </Card>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0"><Clock className="w-4 h-4" /></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Pending Payment</div>
            <div className="text-lg font-bold" style={{ color: HEADING }}>Rs. {(stats.pendingAmount / 1000).toFixed(0)}k</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0"><CheckCircle className="w-4 h-4" /></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Paid This Cycle</div>
            <div className="text-lg font-bold" style={{ color: HEADING }}>Rs. {(stats.paidAmount / 1000).toFixed(0)}k</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0"><Building2 className="w-4 h-4" /></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Buildings Tracked</div>
            <div className="text-lg font-bold" style={{ color: HEADING }}>{properties.length}</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-sm">
            {(['ALL', 'GUARD_SECURITY', 'CLEANING_STAFF', 'GENERATOR_FUEL', 'WATER_TANKER', 'LIFT_MAINTENANCE', 'OTHER'] as const).map(c => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-[13px] whitespace-nowrap transition-colors cursor-pointer',
                  categoryFilter === c ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700'
                )}
              >
                {c === 'ALL' ? 'All Categories' : CATEGORY_META[c].label}
              </button>
            ))}
          </div>

          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="bg-white shadow-[0_1px_4px_rgba(30,42,90,0.08)] rounded-lg px-3.5 py-2 text-sm text-slate-700 font-medium focus:outline-none cursor-pointer shrink-0"
          >
            <option value="ALL">All Buildings</option>
            {properties.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </Card>

      {/* Master-Detail Building Costs */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No building costs found"
          description="No CAM / building running cost records match your active filter."
          actionLabel="Reset Filters"
          onAction={() => { setCategoryFilter('ALL'); setPropertyFilter('ALL'); }}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row" style={{ minHeight: '560px' }}>

            {/* LEFT: expense list */}
            <div className="w-full sm:w-[340px] shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {filtered.map((expense) => {
                const meta = CATEGORY_META[expense.category];
                const Icon = meta.icon;
                const isSelected = selectedExpense?.id === expense.id;
                return (
                  <button
                    key={expense.id}
                    onClick={() => setSelectedExpenseId(expense.id)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 border-b border-l-4 border-slate-100 cursor-pointer transition-colors block',
                      isSelected ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[12px] text-slate-500">{expense.propertyName}</span>
                    </div>
                    <div className="text-[14px] font-semibold truncate" style={{ color: isSelected ? '#2563EB' : HEADING }}>{expense.description}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{expense.monthPeriod} · Rs. {expense.amount.toLocaleString()}</div>
                    <div className="mt-2">
                      {expense.paidStatus === 'PAID' ? (
                        <Badge variant="emerald"><CheckCircle className="w-3 h-3" /><span>Paid</span></Badge>
                      ) : (
                        <Badge variant="amber"><Clock className="w-3 h-3" /><span>Pending</span></Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: detail panel */}
            <div className="flex-1 min-w-0 p-6 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {selectedExpense && (
                <div className="space-y-6">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <Badge variant={CATEGORY_META[selectedExpense.category].variant}>{CATEGORY_META[selectedExpense.category].label}</Badge>
                      </div>
                      <h2 className="text-lg font-bold" style={{ color: HEADING }}>{selectedExpense.description}</h2>
                      <p className="text-[13px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {selectedExpense.propertyName} · {selectedExpense.monthPeriod}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Delete this building cost record?')) {
                          deleteBuildingExpense(selectedExpense.id);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {selectedExpense.paidStatus === 'PENDING' ? (
                    <div className="p-5 rounded-2xl bg-amber-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-amber-700" />
                          <span className="font-bold text-base text-amber-900">Payment Pending</span>
                        </div>
                        <Badge variant="amber">Rs. {selectedExpense.amount.toLocaleString()}</Badge>
                      </div>
                      <p className="text-sm text-amber-800 font-medium leading-relaxed">
                        This building running cost for <strong>{selectedExpense.monthPeriod}</strong> has not been marked as paid yet.
                      </p>
                      <Button
                        variant="emerald"
                        className="w-full font-bold text-base h-12"
                        onClick={() => { markExpensePaid(selectedExpense.id); }}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        <span>Mark as Paid</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-emerald-50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-700" />
                          <span className="font-bold text-base text-emerald-950">Paid</span>
                        </div>
                        <Badge variant="emerald">Rs. {selectedExpense.amount.toLocaleString()}</Badge>
                      </div>
                      <p className="text-sm text-emerald-900 font-medium">Cleared on {selectedExpense.paidDate}.</p>
                    </div>
                  )}

                  <div className="h-px bg-slate-100" />

                  <div>
                    <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2.5">Cost split</div>
                    <div className="p-4 rounded-xl space-y-3" style={{ background: '#EEF1FA' }}>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Units Sharing:</span>
                        <span className="font-bold" style={{ color: HEADING }}>{selectedExpense.unitsSharing}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-white">
                        <span className="text-slate-500 font-medium">Per-Unit Share:</span>
                        <span className="font-bold" style={{ color: HEADING }}>Rs. {Math.round(selectedExpense.amount / selectedExpense.unitsSharing).toLocaleString()}</span>
                      </div>
                      {selectedExpense.notes && (
                        <p className="text-sm text-slate-600 font-medium pt-2 border-t border-white">{selectedExpense.notes}</p>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </Card>
      )}

      {isAddModalOpen && (
        <AddExpenseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} properties={properties} />
      )}
    </div>
  );
};
