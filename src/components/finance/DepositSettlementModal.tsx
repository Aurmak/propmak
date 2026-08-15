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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in text-slate-800">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Move-Out Security Deposit Settlement</h3>
              <p className="text-xs text-slate-500">Audit unpaid utilities & turnaround deductions before lease release</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Target Tenancy Selection */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              1. Select Vacating Unit & Tenant
            </label>
            <select
              value={selectedUnitId}
              onChange={(e) => handleUnitChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-slate-800"
            >
              {rentedUnits.map(u => (
                <option key={u.id} value={u.id}>
                  {u.unitNumber} ({u.propertyName}) — Tenant: {u.renter?.name || 'Occupant'}
                </option>
              ))}
            </select>
          </div>

          {/* Held Deposit Snapshot */}
          <div className="grid grid-cols-2 gap-3 bg-slate-900 text-white p-4 rounded-xl shadow-xs">
            <div>
              <span className="text-slate-400 block text-[11px] font-bold uppercase">Initial Deposit Held</span>
              <span className="text-xl font-extrabold text-amber-400">
                Rs. {heldDeposit.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-bold uppercase">Current Tenant</span>
              <span className="text-sm font-bold text-white block truncate">
                {currentUnit.renter?.name || 'Resident'}
              </span>
              <span className="text-slate-400 text-[11px]">{currentUnit.renter?.phone}</span>
            </div>
          </div>

          {/* Step 2: Utility Arrears Deductions */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                2. Unpaid Utility Arrears (Electricity / Gas / Society)
              </label>
              {totalUnpaidUtilities > 0 && (
                <Badge variant="destructive">Rs. {totalUnpaidUtilities.toLocaleString()} Detected</Badge>
              )}
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              {unitUtilityBills.length > 0 ? (
                unitUtilityBills.map(bill => (
                  <div key={bill.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-200 last:border-0">
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
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              3. Damages, Cleaning & Turnaround Repairs
            </label>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
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
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-emerald-200">
              <span className="font-bold text-emerald-900">Net Refund Payable to Tenant:</span>
              <span className="text-lg font-extrabold text-emerald-700">
                Rs. {netRefund.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Upon confirmation, unit <strong>{currentUnit.unitNumber}</strong> will be marked vacant and prepared for the next lease cycle.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
            >
              <Check className="w-4 h-4 text-amber-400 mr-1" />
              <span>Confirm & Release Deposit (Rs. {netRefund.toLocaleString()})</span>
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};
