'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  X, 
  Star, 
  Check,
  FileText
} from 'lucide-react';
import { MaintenanceTicket } from '../../types';
import { usePropMAK } from '../../context/PropMAKContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

interface AssignContractorModalProps {
  ticket: MaintenanceTicket;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (updatedData: {
    contractor: { name: string; phone: string; trade: string };
    materialCost: number;
    labourCost: number;
    liability: 'LANDLORD_EXPENSE' | 'TENANT_DAMAGE';
    accessInstructions: string;
  }) => void;
}

export const AssignContractorModal: React.FC<AssignContractorModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onAssign
}) => {
  const { contractors } = usePropMAK();

  // Sort: matching trade first, then rest alphabetically
  const sorted = [...contractors].sort((a, b) => {
    const aMatch = a.category === ticket.category;
    const bMatch = b.category === ticket.category;
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return a.name.localeCompare(b.name);
  });

  const [selectedContractorId, setSelectedContractorId] = useState<string>(
    sorted.find(c => c.category === ticket.category)?.id || sorted[0]?.id || ''
  );
  const [materialCost, setMaterialCost] = useState<number>(ticket.materialCost || 0);
  const [labourCost, setLabourCost] = useState<number>(ticket.labourCost || 0);
  const [liability, setLiability] = useState<'LANDLORD_EXPENSE' | 'TENANT_DAMAGE'>('LANDLORD_EXPENSE');
  const [accessInstructions, setAccessInstructions] = useState<string>('Tenant available after 4:00 PM. Master key in Agency Safe.');
  const [appointmentTime, setAppointmentTime] = useState<string>('Tomorrow 11:00 AM');

  if (!isOpen) return null;

  const selectedContractor = contractors.find(c => c.id === selectedContractorId) || sorted[0];
  const totalEstimate = (Number(materialCost) || 0) + (Number(labourCost) || 0);
  const requiresLandlordApproval = totalEstimate > 5000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContractor) return;

    onAssign({
      contractor: {
        name: selectedContractor.name,
        phone: selectedContractor.phone,
        trade: selectedContractor.trade
      },
      materialCost: Number(materialCost) || 0,
      labourCost: Number(labourCost) || 0,
      liability,
      accessInstructions: `${accessInstructions} (Visit: ${appointmentTime})`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in text-slate-800">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Assign Contractor &amp; Enter Inspection Quote
              </h3>
              <p className="text-sm text-slate-600 font-medium">{ticket.ticketNumber} • {ticket.unitName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-sm">
          
          {/* Issue Summary */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 text-sm block">{ticket.title}</span>
            <span className="text-slate-700 text-sm block leading-relaxed">{ticket.description}</span>
          </div>

          {/* Step 1: Select Contractor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-slate-800 font-bold uppercase tracking-wider text-sm">
                1. Select Contractor
              </label>
              <span className="text-xs text-slate-500 font-medium">
                Recommended trade highlighted
              </span>
            </div>

            {sorted.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-sm">
                No contractors in directory yet. Add one from the Contractors tab.
              </div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-0.5">
                {sorted.map(c => {
                  const isSelected = selectedContractorId === c.id;
                  const isTradeMatch = c.category === ticket.category;

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedContractorId(c.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm">{c.name}</span>
                          {isTradeMatch && (
                            <Badge variant="amber" className="text-xs shrink-0">
                              Trade Match
                            </Badge>
                          )}
                          <Badge variant={c.availability === 'AVAILABLE' ? 'emerald' : 'secondary'} className="text-xs shrink-0">
                            {c.availability === 'AVAILABLE' ? 'Available' : c.availability === 'ON_JOB' ? 'On Job' : 'Unavailable'}
                          </Badge>
                        </div>
                        <span className={`text-sm block mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                          {c.trade} • {c.standardRate}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        <div className="flex items-center gap-1 font-bold text-amber-400 text-sm">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{c.rating}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: Quote */}
          <div className="space-y-2.5 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="block text-slate-800 font-bold uppercase tracking-wider text-sm">
                2. Contractor's Quotation
              </label>
              <span className="text-sm font-semibold text-slate-600">Threshold: Rs. 5,000</span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-sm">Material / Parts (Rs.)</label>
                <Input
                  type="number"
                  value={materialCost || ''}
                  onChange={(e) => setMaterialCost(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  className="bg-white font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-sm">Labour / Mazdoori (Rs.)</label>
                <Input
                  type="number"
                  value={labourCost || ''}
                  onChange={(e) => setLabourCost(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  className="bg-white font-bold text-sm"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl border flex items-center justify-between gap-2 text-sm bg-white border-slate-200">
              <div>
                <span className="text-slate-700 font-medium">Total Quote: </span>
                <strong className="text-slate-950 text-base font-black">Rs. {totalEstimate.toLocaleString()}</strong>
              </div>
              {totalEstimate === 0 ? (
                <Badge variant="outline">Quote Pending (Initial Dispatch)</Badge>
              ) : requiresLandlordApproval ? (
                <Badge variant="amber">⚠️ Over Rs. 5k — Requires Landlord Approval</Badge>
              ) : (
                <Badge variant="emerald">✓ Within Limit — Auto-Authorized</Badge>
              )}
            </div>
          </div>

          {/* Step 3: Liability */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <label className="block text-slate-800 font-bold uppercase tracking-wider text-sm">
              3. Expense Liability
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLiability('LANDLORD_EXPENSE')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  liability === 'LANDLORD_EXPENSE' 
                    ? 'bg-slate-900 text-white border-slate-900 font-bold' 
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <span className="block font-bold text-sm">Landlord Expense</span>
                <span className="block text-sm opacity-80 mt-0.5">Deducted from monthly rent payout</span>
              </button>
              <button
                type="button"
                onClick={() => setLiability('TENANT_DAMAGE')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  liability === 'TENANT_DAMAGE' 
                    ? 'bg-slate-900 text-white border-slate-900 font-bold' 
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <span className="block font-bold text-sm">Tenant Liability</span>
                <span className="block text-sm opacity-80 mt-0.5">Billed to resident or deposit</span>
              </button>
            </div>
          </div>

          {/* Step 4: Access */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <label className="block text-slate-800 font-bold uppercase tracking-wider text-sm">
              4. Site Visit &amp; Access Schedule
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">Scheduled Visit Time</label>
                <Input
                  type="text"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  placeholder="e.g. Tomorrow 11:00 AM"
                  className="bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">Access / Key Notes</label>
                <Input
                  type="text"
                  value={accessInstructions}
                  onChange={(e) => setAccessInstructions(e.target.value)}
                  placeholder="e.g. Master key in Safe Box #12"
                  className="bg-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Work Order Brief */}
          {selectedContractor && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <FileText className="w-4 h-4 text-slate-700" />
                <span>Work Order Dispatch Brief — {selectedContractor.name}</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-700 font-medium">
                &quot;Job Dispatch: {ticket.title} at {ticket.unitName}. Resident: {ticket.tenantName} ({ticket.tenantPhone}). Schedule: {appointmentTime}. Quote: Rs. {totalEstimate.toLocaleString()}. Key/Access: {accessInstructions}&quot;
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose} className="font-bold text-sm">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={!selectedContractor}
              className="font-bold text-sm"
            >
              <Check className="w-4 h-4 text-amber-400 mr-1.5" />
              <span>
                {totalEstimate > 0 ? `Submit Quote & Dispatch (Rs. ${totalEstimate.toLocaleString()})` : 'Dispatch Contractor for Inspection'}
              </span>
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
