'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Flame, 
  Droplets, 
  Building, 
  X, 
  Check, 
  DollarSign, 
  Calendar 
} from 'lucide-react';
import { Unit, UtilityBillRecord, UtilityType } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AddUtilityBillModalProps {
  units: Unit[];
  isOpen: boolean;
  onClose: () => void;
  onAddBill: (data: Omit<UtilityBillRecord, 'id'>) => void;
}

export const AddUtilityBillModal: React.FC<AddUtilityBillModalProps> = ({
  units,
  isOpen,
  onClose,
  onAddBill
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState(units[0]?.id || '');
  const [utilityType, setUtilityType] = useState<UtilityType>('ELECTRICITY');
  const [consumerNumber, setConsumerNumber] = useState('0400012345678');
  const [monthPeriod, setMonthPeriod] = useState('August 2026');
  const [amount, setAmount] = useState<number>(24500);
  const [dueDate, setDueDate] = useState('2026-08-20');
  const [paidStatus, setPaidStatus] = useState<'PAID' | 'PENDING' | 'OVERDUE'>('PENDING');

  if (!isOpen) return null;

  const currentUnit = units.find(u => u.id === selectedUnitId) || units[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUnit) return;

    onAddBill({
      unitId: currentUnit.id,
      unitName: currentUnit.unitNumber,
      propertyName: currentUnit.propertyName,
      tenantName: currentUnit.renter?.name || 'Resident',
      utilityType,
      consumerNumber,
      monthPeriod,
      amount,
      dueDate,
      paidStatus,
      verifiedAt: paidStatus === 'PAID' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in text-slate-800">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Log Monthly Utility Bill</h3>
              <p className="text-xs text-slate-500">Record electricity, gas, water, or building maintenance dues</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Target Unit */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Target Property / Unit *</label>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-800"
            >
              {units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.unitNumber} ({u.propertyName}) — {u.renter?.name || 'Vacant'}
                </option>
              ))}
            </select>
          </div>

          {/* Utility Type & Billing Month */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Utility Type *</label>
              <select
                value={utilityType}
                onChange={(e) => setUtilityType(e.target.value as UtilityType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-800"
              >
                <option value="ELECTRICITY">Electricity (K-Electric / LESCO / IESCO)</option>
                <option value="GAS">Sui Gas (SSGC / SNGPL)</option>
                <option value="WATER">Water / WASA Utility</option>
                <option value="BUILDING_SERVICE_CHARGE">Building / Society Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Billing Month</label>
              <Input
                type="text"
                value={monthPeriod}
                onChange={(e) => setMonthPeriod(e.target.value)}
                placeholder="e.g. August 2026"
                className="bg-white"
              />
            </div>
          </div>

          {/* Consumer Number & Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Consumer / Account No. *</label>
              <Input
                type="text"
                required
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                placeholder="e.g. 0400012345678"
                className="bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Bill Amount (Rs.) *</label>
              <Input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="e.g. 24500"
                className="bg-white font-bold"
              />
            </div>
          </div>

          {/* Due Date & Paid Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Clearance Status</label>
              <select
                value={paidStatus}
                onChange={(e) => setPaidStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-800"
              >
                <option value="PENDING">Pending Payment / Upload</option>
                <option value="PAID">Paid & Verified</option>
                <option value="OVERDUE">Overdue Arrears</option>
              </select>
            </div>
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
              <span>Save & Log Utility Bill</span>
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};
