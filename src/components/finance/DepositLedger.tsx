'use client';

import React, { useState, useMemo } from 'react';
import {
  KeyRound,
  Plus,
  X,
  Check,
  Trash2,
  Building2,
  Wallet,
  CheckCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EmptyState } from '../ui/EmptyState';
import { ComboBox } from '../ui/ComboBox';
import { cn } from '@/lib/utils';

const HEADING = '#1B2559';

interface DepositLedgerProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

// ─── Add Deposit Record Modal ────────────────────────────────────────────────

const AddDepositModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { units, addDepositRecord } = usePropMAK();
  const rentedUnits = units.filter(u => u.renter);

  const [unitId, setUnitId] = useState(rentedUnits[0]?.id || '');
  const [securityDepositHeld, setSecurityDepositHeld] = useState<number>(0);
  const [advanceRentMonths, setAdvanceRentMonths] = useState<number>(1);
  const [collectedDate, setCollectedDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const currentUnit = units.find(u => u.id === unitId);
  const advanceRentHeld = (currentUnit?.monthlyRent || 0) * advanceRentMonths;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUnit || !currentUnit.renter) return;

    addDepositRecord({
      unitId: currentUnit.id,
      unitName: currentUnit.unitNumber,
      propertyName: currentUnit.propertyName,
      tenantName: currentUnit.renter.name,
      tenantPhone: currentUnit.renter.phone,
      securityDepositHeld,
      advanceRentHeld,
      advanceRentMonths,
      collectedDate
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in text-slate-800">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 flex items-center justify-between" style={{ background: '#EEF1FA' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight" style={{ color: HEADING }}>Record Deposit / Advance Rent Collected</h3>
              <p className="text-xs text-slate-500">Log what was held from a tenant at move-in</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Tenant / Unit *</label>
            <ComboBox
              options={rentedUnits.map(u => ({
                value: u.id,
                label: u.unitNumber,
                sublabel: `${u.propertyName} — ${u.renter?.name}`,
                group: u.propertyName
              }))}
              value={unitId}
              onChange={setUnitId}
              placeholder="Select a tenanted unit…"
              searchPlaceholder="Search by unit, property or tenant…"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Security Deposit Held (Rs.) *</label>
              <Input
                type="number"
                required
                value={securityDepositHeld || ''}
                onChange={(e) => setSecurityDepositHeld(Number(e.target.value))}
                placeholder="e.g. 220000"
                className="bg-white font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Advance Rent (Months)</label>
              <Input
                type="number"
                min={0}
                value={advanceRentMonths}
                onChange={(e) => setAdvanceRentMonths(Number(e.target.value))}
                className="bg-white font-bold"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: '#EEF1FA' }}>
            <span className="font-bold text-slate-700">Advance Rent Held:</span>
            <span className="font-bold" style={{ color: HEADING }}>Rs. {advanceRentHeld.toLocaleString()}</span>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Date Collected</label>
            <Input
              type="date"
              value={collectedDate}
              onChange={(e) => setCollectedDate(e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose} className="bg-white">Cancel</Button>
            <Button type="submit" variant="default">
              <Check className="w-4 h-4 mr-1" />
              <span>Save to Ledger</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const DepositLedger: React.FC<DepositLedgerProps> = ({ onOpenWhatsAppWithMessage }) => {
  const { depositRecords, settleDeposit, deleteDepositRecord } = usePropMAK();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'HELD' | 'REFUNDED'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [settling, setSettling] = useState(false);
  const [utilityDeduction, setUtilityDeduction] = useState<number>(0);
  const [damageDeduction, setDamageDeduction] = useState<number>(0);
  const [deductionNotes, setDeductionNotes] = useState<string>('');

  const filtered = useMemo(() => depositRecords.filter(d => statusFilter === 'ALL' || d.status === statusFilter), [depositRecords, statusFilter]);

  const stats = useMemo(() => {
    const held = depositRecords.filter(d => d.status === 'HELD');
    return {
      heldCount: held.length,
      heldDeposits: held.reduce((s, d) => s + d.securityDepositHeld, 0),
      heldAdvance: held.reduce((s, d) => s + d.advanceRentHeld, 0),
      refundedTotal: depositRecords.filter(d => d.status === 'REFUNDED').reduce((s, d) => s + (d.netRefundAmount || 0), 0)
    };
  }, [depositRecords]);

  const selectedRecord = filtered.find(d => d.id === selectedRecordId) || filtered[0] || null;

  const selectRecord = (id: string) => {
    setSelectedRecordId(id);
    setSettling(false);
    setUtilityDeduction(0);
    setDamageDeduction(0);
    setDeductionNotes('');
  };

  const netRefund = selectedRecord ? Math.max(0, selectedRecord.securityDepositHeld - utilityDeduction - damageDeduction) : 0;

  const confirmSettlement = () => {
    if (!selectedRecord) return;
    settleDeposit(selectedRecord.id, {
      utilityDeductions: utilityDeduction,
      damageDeductions: damageDeduction,
      deductionNotes,
      netRefundAmount: netRefund
    });

    if (onOpenWhatsAppWithMessage && selectedRecord.tenantPhone) {
      onOpenWhatsAppWithMessage(
        `Deposit Settlement for ${selectedRecord.unitName} (${selectedRecord.propertyName}). Held: Rs. ${selectedRecord.securityDepositHeld.toLocaleString()}. Deductions: Rs. ${(utilityDeduction + damageDeduction).toLocaleString()}. Net Refund: Rs. ${netRefund.toLocaleString()}.`,
        selectedRecord.tenantPhone
      );
    }

    setSettling(false);
  };

  return (
    <div className="space-y-6 text-slate-900 text-sm animate-in fade-in">

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: HEADING }}>Security Deposits & Advance Rent</h1>
              <Badge variant="secondary">{depositRecords.length} Records</Badge>
            </div>
            <p className="text-sm text-slate-500 font-medium mt-1">
              What&apos;s held per tenancy, and the refund/deduction workflow at move-out
            </p>
          </div>
          <Button variant="default" onClick={() => setIsAddModalOpen(true)} className="font-bold text-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Record Deposit Collected</span>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0"><Lock className="w-4 h-4" /></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Deposits Held</div>
            <div className="text-lg font-bold" style={{ color: HEADING }}>Rs. {(stats.heldDeposits / 1000).toFixed(0)}k</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0"><Wallet className="w-4 h-4" /></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Advance Rent Held</div>
            <div className="text-lg font-bold" style={{ color: HEADING }}>Rs. {(stats.heldAdvance / 1000).toFixed(0)}k</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0"><Unlock className="w-4 h-4" /></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Refunded Historically</div>
            <div className="text-lg font-bold" style={{ color: HEADING }}>Rs. {(stats.refundedTotal / 1000).toFixed(0)}k</div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-sm">
          {(['ALL', 'HELD', 'REFUNDED'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-[13px] whitespace-nowrap transition-colors cursor-pointer',
                statusFilter === s ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700'
              )}
            >
              {s === 'ALL' ? `All (${depositRecords.length})` : s === 'HELD' ? `Currently Held (${stats.heldCount})` : 'Refunded'}
            </button>
          ))}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={KeyRound}
          title="No deposit records found"
          description="No security deposit or advance rent records match your filter."
          actionLabel="Reset Filter"
          onAction={() => setStatusFilter('ALL')}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row" style={{ minHeight: '560px' }}>

            {/* LEFT: deposit record list */}
            <div className="w-full sm:w-[340px] shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {filtered.map((record) => {
                const isSelected = selectedRecord?.id === record.id;
                return (
                  <button
                    key={record.id}
                    onClick={() => selectRecord(record.id)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 border-b border-l-4 border-slate-100 cursor-pointer transition-colors block',
                      isSelected ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('w-2 h-2 rounded-full shrink-0', record.status === 'HELD' ? 'bg-blue-500' : 'bg-emerald-500')} />
                      <span className="text-[12px] text-slate-500">{record.collectedDate}</span>
                    </div>
                    <div className="text-[14px] font-semibold truncate" style={{ color: isSelected ? '#2563EB' : HEADING }}>{record.unitName}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{record.tenantName} · Rs. {record.securityDepositHeld.toLocaleString()}</div>
                    <div className="mt-2">
                      {record.status === 'HELD' ? (
                        <Badge variant="blue"><Lock className="w-3 h-3" /><span>Held</span></Badge>
                      ) : (
                        <Badge variant="emerald"><CheckCircle className="w-3 h-3" /><span>Refunded</span></Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: detail panel */}
            <div className="flex-1 min-w-0 p-6 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {selectedRecord && (
                <div className="space-y-6">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        {selectedRecord.status === 'HELD' ? (
                          <Badge variant="blue">Currently Held</Badge>
                        ) : (
                          <Badge variant="emerald">Refunded</Badge>
                        )}
                      </div>
                      <h2 className="text-lg font-bold" style={{ color: HEADING }}>{selectedRecord.tenantName}</h2>
                      <p className="text-[13px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {selectedRecord.unitName} · {selectedRecord.propertyName}
                      </p>
                    </div>
                    {!settling && selectedRecord.status === 'HELD' && (
                      <button
                        onClick={() => {
                          if (confirm('Delete this deposit record?')) {
                            deleteDepositRecord(selectedRecord.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl" style={{ background: '#EEF1FA' }}>
                    <div>
                      <span className="block text-[11px] font-bold uppercase text-slate-500">Security Deposit</span>
                      <span className="text-xl font-bold" style={{ color: HEADING }}>Rs. {selectedRecord.securityDepositHeld.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase text-slate-500">Advance Rent</span>
                      <span className="text-xl font-bold" style={{ color: HEADING }}>Rs. {selectedRecord.advanceRentHeld.toLocaleString()}</span>
                      <span className="text-slate-500 text-[11px] block">{selectedRecord.advanceRentMonths} month(s)</span>
                    </div>
                  </div>

                  {selectedRecord.status === 'REFUNDED' ? (
                    <div className="p-4 rounded-xl bg-emerald-50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900">Net Refund Paid:</span>
                        <span className="text-lg font-bold text-emerald-700">Rs. {selectedRecord.netRefundAmount?.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-emerald-800 space-y-1 pt-2 border-t border-emerald-200">
                        <div className="flex justify-between"><span>Utility Deductions:</span><span className="font-bold">Rs. {selectedRecord.utilityDeductions?.toLocaleString() || 0}</span></div>
                        <div className="flex justify-between"><span>Damage Deductions:</span><span className="font-bold">Rs. {selectedRecord.damageDeductions?.toLocaleString() || 0}</span></div>
                        <div className="flex justify-between"><span>Refunded On:</span><span className="font-bold">{selectedRecord.refundedDate}</span></div>
                      </div>
                      {selectedRecord.deductionNotes && (
                        <p className="text-xs text-emerald-800 pt-2 border-t border-emerald-200">{selectedRecord.deductionNotes}</p>
                      )}
                    </div>
                  ) : !settling ? (
                    <Button
                      variant="default"
                      className="w-full font-bold text-base h-12"
                      onClick={() => setSettling(true)}
                    >
                      <Unlock className="w-4 h-4 mr-2" />
                      <span>Settle & Refund (Move-Out)</span>
                    </Button>
                  ) : (
                    <div className="p-4 rounded-xl space-y-3" style={{ background: '#EEF1FA' }}>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Move-Out Settlement</span>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Unpaid Utilities (Rs.)</label>
                          <Input type="number" value={utilityDeduction || ''} onChange={e => setUtilityDeduction(Number(e.target.value))} className="bg-white text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Damage / Cleaning (Rs.)</label>
                          <Input type="number" value={damageDeduction || ''} onChange={e => setDamageDeduction(Number(e.target.value))} className="bg-white text-sm" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Deduction Notes</label>
                        <Input value={deductionNotes} onChange={e => setDeductionNotes(e.target.value)} placeholder="e.g. Paint repair, lock replacement" className="bg-white text-sm" />
                      </div>

                      <div className="p-3 rounded-lg bg-emerald-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900">Net Refund:</span>
                        <span className="text-base font-bold text-emerald-700">Rs. {netRefund.toLocaleString()}</span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button onClick={confirmSettlement} className="flex-1 h-10 font-bold text-sm">
                          <Check className="w-4 h-4 mr-1.5" />
                          Confirm Refund
                        </Button>
                        <Button variant="outline" onClick={() => setSettling(false)} className="h-10 font-bold text-sm bg-white">Cancel</Button>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        </Card>
      )}

      {isAddModalOpen && (
        <AddDepositModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};
