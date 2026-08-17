'use client';

import React, { useState } from 'react';
import {
  Receipt,
  X,
  User,
  Building2,
  Zap,
  Flame,
  Droplets,
  Check,
  AlertTriangle,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import { Unit, UtilityBillRecord } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { ComboBox } from '../ui/ComboBox';

const HEADING = '#1B2559';

interface DepositSettlementModalProps {
  units: Unit[];
  utilityBills: UtilityBillRecord[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmSettlement: (settlement: {
    unitId: string;
    tenantName: string;
    heldDeposit: number;
    utilityDeductions: number;
    damageDeductions: number;
    netRefund: number;
    deductionNotes: string;
  }) => void;
  onOpenWhatsApp?: (msg: string, phone?: string) => void;
}

export const DepositSettlementModal: React.FC<DepositSettlementModalProps> = ({
  units,
  utilityBills,
  isOpen,
  onClose,
  onConfirmSettlement,
  onOpenWhatsApp
}) => {
  const rentedUnits = units.filter(u => u.renter !== null);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(rentedUnits[0]?.id || units[0]?.id || '');

  const currentUnit = units.find(u => u.id === selectedUnitId) || units[0];
  const heldDeposit = currentUnit?.securityDeposit || (currentUnit?.monthlyRent ? currentUnit.monthlyRent * 2 : 300000);

  // Unpaid utility bills for this unit
  const unitUtilityBills = utilityBills.filter(b => b.unitId === selectedUnitId && (b.paidStatus === 'PENDING' || b.paidStatus === 'OVERDUE'));
  const totalUnpaidUtilities = unitUtilityBills.reduce((acc, b) => acc + b.amount, 0);

  const [utilityDeduction, setUtilityDeduction] = useState<number>(totalUnpaidUtilities);
  const [damageDeduction, setDamageDeduction] = useState<number>(15000);
  const [damageNotes, setDamageNotes] = useState<string>('Paint retouching for 2 bedrooms + lock replacement on entrance door');

  if (!isOpen || !currentUnit) return null;

  const netRefund = Math.max(0, heldDeposit - utilityDeduction - damageDeduction);

  const handleUnitChange = (unitId: string) => {
    setSelectedUnitId(unitId);
    const unpaids = utilityBills
      .filter(b => b.unitId === unitId && (b.paidStatus === 'PENDING' || b.paidStatus === 'OVERDUE'))
      .reduce((acc, b) => acc + b.amount, 0);
    setUtilityDeduction(unpaids);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onConfirmSettlement({
      unitId: currentUnit.id,
      tenantName: currentUnit.renter?.name || 'Tenant',
      heldDeposit,
      utilityDeductions: utilityDeduction,
      damageDeductions: damageDeduction,
      netRefund,
      deductionNotes: damageNotes
    });

    if (onOpenWhatsApp && currentUnit.renter?.phone) {
      onOpenWhatsApp(
        `Move-Out Deposit Settlement Statement for ${currentUnit.unitNumber} (${currentUnit.propertyName}). Initial Deposit Held: Rs. ${heldDeposit.toLocaleString()}. Unpaid Utility Deductions: Rs. ${utilityDeduction.toLocaleString()}. Repair/Paint Deductions: Rs. ${damageDeduction.toLocaleString()}. Net Security Deposit Refund: Rs. ${netRefund.toLocaleString()}. Notes: ${damageNotes}`,
        currentUnit.renter.phone
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in text-slate-800">
      <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-5 flex items-center justify-between" style={{ background: '#EEF1FA' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight" style={{ color: HEADING }}>Move-Out Security Deposit Settlement</h3>
              <p className="text-xs text-slate-500">Audit unpaid utilities & turnaround deductions before lease release</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">

          {/* Target Tenancy Selection */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              1. Select Vacating Unit &amp; Tenant
            </label>
            <ComboBox
              options={rentedUnits.map(u => ({
                value: u.id,
                label: u.unitNumber,
                sublabel: `${u.propertyName} — ${u.renter?.name || 'Occupant'}`,
                group: u.propertyName
              }))}
              value={selectedUnitId}
              onChange={handleUnitChange}
              placeholder="Select vacating unit…"
              searchPlaceholder="Search by unit, property or tenant…"
            />
          </div>

          {/* Held Deposit Snapshot */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl" style={{ background: '#EEF1FA' }}>
            <div>
              <span className="block text-[11px] font-bold uppercase text-slate-500">Initial Deposit Held</span>
              <span className="text-xl font-bold" style={{ color: HEADING }}>
                Rs. {heldDeposit.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase text-slate-500">Current Tenant</span>
              <span className="text-sm font-bold block truncate" style={{ color: HEADING }}>
                {currentUnit.renter?.name || 'Resident'}
              </span>
              <span className="text-slate-500 text-[11px]">{currentUnit.renter?.phone}</span>
            </div>
          </div>

          {/* Step 2: Utility Arrears Deductions */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                2. Unpaid Utility Arrears (Electricity / Gas / Society)
              </label>
              {totalUnpaidUtilities > 0 && (
                <Badge variant="destructive">Rs. {totalUnpaidUtilities.toLocaleString()} Detected</Badge>
              )}
            </div>

            <div className="p-3.5 rounded-xl space-y-2" style={{ background: '#EEF1FA' }}>
              {unitUtilityBills.length > 0 ? (
                unitUtilityBills.map(bill => (
                  <div key={bill.id} className="flex items-center justify-between text-xs py-1 border-b border-white last:border-0">
                    <span className="text-slate-700 font-medium">
                      {bill.utilityType.replace(/_/g, ' ')} ({bill.monthPeriod})
                    </span>
                    <span className="font-bold text-rose-700">Rs. {bill.amount.toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No unpaid utility bills logged in registry for this unit.</p>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Total Utility Deduction (Rs.):</span>
                <Input
                  type="number"
                  value={utilityDeduction}
                  onChange={(e) => setUtilityDeduction(Number(e.target.value))}
                  className="w-32 bg-white text-right font-bold"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Damage & Turnaround Deductions */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              3. Damages, Cleaning & Turnaround Repairs
            </label>

            <div className="p-3.5 rounded-xl space-y-2" style={{ background: '#EEF1FA' }}>
              <div>
                <label className="block text-slate-600 font-bold mb-1">Itemized Deduction Details</label>
                <Input
                  type="text"
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  placeholder="e.g. Paint repair, deep cleaning, broken fixture..."
                  className="bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-slate-700">Damage Deduction Amount (Rs.):</span>
                <Input
                  type="number"
                  value={damageDeduction}
                  onChange={(e) => setDamageDeduction(Number(e.target.value))}
                  className="w-32 bg-white text-right font-bold"
                />
              </div>
            </div>
          </div>

          {/* Net Settlement Calculation Callout */}
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-950 space-y-2">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-emerald-200">
              <span className="font-bold text-emerald-900">Net Refund Payable to Tenant:</span>
              <span className="text-lg font-bold text-emerald-700">
                Rs. {netRefund.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Upon confirmation, unit <strong>{currentUnit.unitNumber}</strong> will be marked vacant and prepared for the next lease cycle.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
            >
              <Check className="w-4 h-4 mr-1" />
              <span>Confirm & Release Deposit (Rs. {netRefund.toLocaleString()})</span>
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};
