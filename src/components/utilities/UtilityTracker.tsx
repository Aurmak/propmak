'use client';

import React, { useState } from 'react';
import {
  Zap,
  Flame,
  Droplets,
  Building2,
  CheckCircle,
  Clock,
  Plus,
  Check,
  Trash2,
  MessageSquare,
  Search
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { UtilityType } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EmptyState } from '../ui/EmptyState';
import { AddUtilityBillModal } from './AddUtilityBillModal';
import { cn } from '@/lib/utils';

const HEADING = '#1B2559';

interface UtilityTrackerProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

export const UtilityTracker: React.FC<UtilityTrackerProps> = ({
  onOpenWhatsAppWithMessage
}) => {
  const {
    utilityBills,
    units,
    addUtilityBill,
    updateUtilityBill,
    deleteUtilityBill,
    searchQuery,
    setSearchQuery
  } = usePropMAK();

  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);

  const filteredBills = utilityBills.filter(bill => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = bill.unitName.toLowerCase().includes(q) ||
        bill.consumerNumber.toLowerCase().includes(q) ||
        bill.tenantName.toLowerCase().includes(q) ||
        bill.monthPeriod.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (typeFilter === 'ALL') return true;
    return bill.utilityType === typeFilter;
  });

  const getUtilityBadge = (type: UtilityType) => {
    switch (type) {
      case 'ELECTRICITY':
        return { label: 'Electricity', icon: Zap, variant: 'amber' as const };
      case 'GAS':
        return { label: 'Sui Gas', icon: Flame, variant: 'purple' as const };
      case 'WATER':
        return { label: 'Water & Tanker', icon: Droplets, variant: 'blue' as const };
      case 'BUILDING_SERVICE_CHARGE':
      default:
        return { label: 'Society Charges', icon: Building2, variant: 'emerald' as const };
    }
  };

  const pendingClearanceCount = utilityBills.filter(b => b.paidStatus === 'PENDING').length;

  const selectedBill = filteredBills.find(b => b.id === selectedBillId) || filteredBills[0] || null;

  return (
    <div className="space-y-6 text-slate-900 text-sm animate-in fade-in">

      {/* Top Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: HEADING }}>
                Utility Bills & Meter Clearance
              </h1>
              <Badge variant="secondary">
                {utilityBills.length} Bill Records
              </Badge>
              {pendingClearanceCount > 0 && (
                <Badge variant="amber">
                  {pendingClearanceCount} Pending Proof
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Electricity, Gas, Water, and Society service bills custody & clearance tracking
            </p>
          </div>

          <Button
            variant="default"
            onClick={() => setIsAddModalOpen(true)}
            className="font-bold text-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Log Utility Bill</span>
          </Button>
        </div>
      </Card>

      {/* Filter Toolbar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

          {/* Type Filter Tabs — contained track, distinct from status badges */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-sm">
            {[
              { id: 'ALL', label: `All Bills (${utilityBills.length})` },
              { id: 'ELECTRICITY', label: 'Electricity (LESCO/K-Elec)', icon: Zap },
              { id: 'GAS', label: 'Sui Gas (SNGPL)', icon: Flame },
              { id: 'WATER', label: 'Water & Tanker', icon: Droplets },
              { id: 'BUILDING_SERVICE_CHARGE', label: 'Society Charges', icon: Building2 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-[13px] whitespace-nowrap transition-colors cursor-pointer flex items-center',
                  typeFilter === tab.id ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700'
                )}
              >
                {tab.icon && <tab.icon className="w-4 h-4 mr-1.5" />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search consumer #, unit, month..."
              className="pl-9 h-9 text-sm bg-white font-medium"
            />
          </div>

        </div>
      </Card>

      {/* Master-Detail Utility Bills */}
      {filteredBills.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No utility bills found"
          description="No utility or society service charge records match your active filter."
          actionLabel="Reset Utility Filter"
          onAction={() => {
            setTypeFilter('ALL');
            setSearchQuery('');
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row" style={{ minHeight: '560px' }}>

            {/* LEFT: bill list */}
            <div className="w-full sm:w-[340px] shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {filteredBills.map((bill) => {
                const badge = getUtilityBadge(bill.utilityType);
                const Icon = badge.icon;
                const isSelected = selectedBill?.id === bill.id;
                return (
                  <button
                    key={bill.id}
                    onClick={() => setSelectedBillId(bill.id)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 border-b border-l-4 border-slate-100 cursor-pointer transition-colors block',
                      isSelected ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[12px] font-mono text-slate-500">{bill.consumerNumber}</span>
                    </div>
                    <div className="text-[14px] font-semibold truncate" style={{ color: isSelected ? '#2563EB' : HEADING }}>{bill.unitName}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{bill.monthPeriod} · Rs. {bill.amount.toLocaleString()}</div>
                    <div className="mt-2">
                      {bill.paidStatus === 'PAID' ? (
                        <Badge variant="emerald"><CheckCircle className="w-3 h-3" /><span>Cleared</span></Badge>
                      ) : (
                        <Badge variant="amber"><Clock className="w-3 h-3" /><span>Pending Proof</span></Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: detail panel */}
            <div className="flex-1 min-w-0 p-6 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {selectedBill && (
                <div className="space-y-6">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <Badge variant={getUtilityBadge(selectedBill.utilityType).variant}>
                          {getUtilityBadge(selectedBill.utilityType).label}
                        </Badge>
                        <span className="text-[12px] text-slate-400 font-mono">ID: {selectedBill.consumerNumber}</span>
                      </div>
                      <h2 className="text-lg font-bold" style={{ color: HEADING }}>
                        {getUtilityBadge(selectedBill.utilityType).label} Bill: Rs. {selectedBill.amount.toLocaleString()}
                      </h2>
                      <p className="text-[13px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {selectedBill.unitName} · {selectedBill.monthPeriod}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this utility record?')) {
                          deleteUtilityBill(selectedBill.id);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                      title="Delete bill record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Primary Action Card */}
                  {selectedBill.paidStatus === 'PENDING' ? (
                    <div className="p-5 rounded-2xl bg-amber-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-amber-700" />
                          <span className="font-bold text-base text-amber-900">Action Required: Bill Clearance</span>
                        </div>
                        <Badge variant="amber">Proof Pending</Badge>
                      </div>
                      <p className="text-sm text-amber-800 font-medium leading-relaxed">
                        Tenant proof of utility payment is pending for <strong>{selectedBill.monthPeriod}</strong>. Verify the paid slip and mark as cleared to update the property audit.
                      </p>

                      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                        <Button
                          variant="emerald"
                          className="w-full sm:flex-1 font-bold text-base h-12"
                          onClick={() => {
                            updateUtilityBill(selectedBill.id, {
                              paidStatus: 'PAID',
                              verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            });
                          }}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          <span>Mark Bill Paid & Cleared</span>
                        </Button>

                        {onOpenWhatsAppWithMessage && (
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto font-bold text-base h-12 bg-white"
                            onClick={() => {
                              onOpenWhatsAppWithMessage(
                                `Hello ${selectedBill.tenantName}, kindly upload your paid ${getUtilityBadge(selectedBill.utilityType).label} bill photo for ${selectedBill.monthPeriod} (${selectedBill.unitName}) to complete monthly utility audit. Thank you.`,
                                '+1 (555) 234-5678'
                              );
                            }}
                          >
                            <MessageSquare className="w-4 h-4 text-emerald-600 mr-2" />
                            <span>Send Proof Request</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-emerald-50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-700" />
                          <span className="font-bold text-base text-emerald-950">Utility Bill Cleared & Audited</span>
                        </div>
                        <Badge variant="emerald">Cleared</Badge>
                      </div>
                      <p className="text-sm text-emerald-900 font-medium">
                        This bill of <strong>Rs. {selectedBill.amount.toLocaleString()}</strong> has been audited and cleared for <strong>{selectedBill.monthPeriod}</strong>.
                      </p>
                    </div>
                  )}

                  <div className="h-px bg-slate-100" />

                  {/* Bill Details Breakdown */}
                  <div>
                    <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2.5">Consumer account & tariff</div>
                    <div className="p-4 rounded-xl space-y-3" style={{ background: '#EEF1FA' }}>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-500 font-medium block">Assigned Resident:</span>
                          <strong className="block" style={{ color: HEADING }}>{selectedBill.tenantName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Consumer Account ID:</span>
                          <strong className="font-mono block" style={{ color: HEADING }}>{selectedBill.consumerNumber}</strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white space-y-1.5 text-sm">
                        <div className="flex justify-between text-slate-600">
                          <span>Billing Cycle:</span>
                          <span className="font-bold" style={{ color: HEADING }}>{selectedBill.monthPeriod}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Due Date:</span>
                          <span className="font-bold" style={{ color: HEADING }}>{selectedBill.dueDate || '15th of month'}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold pt-2 border-t border-white" style={{ color: HEADING }}>
                          <span>Gross Bill Amount:</span>
                          <span className="text-lg font-bold">
                            Rs. {selectedBill.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attached Paid Bill Photo if any */}
                  {selectedBill.billSlipUrl && (
                    <>
                      <div className="h-px bg-slate-100" />
                      <div>
                        <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2.5">
                          Attached paid bill proof / bank stamp
                        </div>
                        <div className="rounded-xl overflow-hidden p-1.5" style={{ background: '#EEF1FA' }}>
                          <img
                            src={selectedBill.billSlipUrl}
                            alt="Paid utility receipt"
                            className="w-full h-64 object-contain rounded-lg bg-slate-900"
                          />
                        </div>
                      </div>
                    </>
                  )}

                </div>
              )}
            </div>

          </div>
        </Card>
      )}

      {/* Add Utility Bill Modal */}
      {isAddModalOpen && (
        <AddUtilityBillModal
          isOpen={isAddModalOpen}
          units={units}
          onClose={() => setIsAddModalOpen(false)}
          onAddBill={(billData) => {
            addUtilityBill(billData);
            setIsAddModalOpen(false);
          }}
        />
      )}

    </div>
  );
};
