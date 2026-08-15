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
  Search, 
  FileText, 
  ArrowRight,
  Eye,
  Camera
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { UtilityBillRecord, UtilityType } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../ui/table';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '../ui/sheet';
import { EmptyState } from '../ui/EmptyState';
import { AddUtilityBillModal } from './AddUtilityBillModal';

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
  const [activeInspectorBill, setActiveInspectorBill] = useState<UtilityBillRecord | null>(null);

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

  return (
    <div className="space-y-6 text-slate-900 text-sm animate-in fade-in">
      
      {/* Top Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Utility Bills & Meter Clearance
              </h1>
              <Badge variant="secondary">
                {utilityBills.length} Bill Records
              </Badge>
              {pendingClearanceCount > 0 && (
                <Badge variant="amber" className="animate-pulse">
                  {pendingClearanceCount} Pending Proof
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Electricity, Gas, Water, and Society service bills custody & clearance tracking
            </p>
          </div>

          <Button
            variant="default"
            onClick={() => setIsAddModalOpen(true)}
            className="font-bold text-sm"
          >
            <Plus className="w-4 h-4 text-amber-400 mr-1.5" />
            <span>Log Utility Bill</span>
          </Button>
        </div>
      </Card>

      {/* Filter Toolbar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Type Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto text-sm">
            {[
              { id: 'ALL', label: `All Bills (${utilityBills.length})` },
              { id: 'ELECTRICITY', label: 'Electricity (LESCO/K-Elec)', icon: Zap },
              { id: 'GAS', label: 'Sui Gas (SNGPL)', icon: Flame },
              { id: 'WATER', label: 'Water & Tanker', icon: Droplets },
              { id: 'BUILDING_SERVICE_CHARGE', label: 'Society Charges', icon: Building2 }
            ].map(tab => (
              <Button
                key={tab.id}
                size="sm"
                variant={typeFilter === tab.id ? 'default' : 'ghost'}
                onClick={() => setTypeFilter(tab.id)}
                className="h-9 px-3.5 text-sm font-bold whitespace-nowrap cursor-pointer"
              >
                {tab.icon && <tab.icon className="w-4 h-4 mr-1.5" />}
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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

      {/* Streamlined 5-Column Utility Table */}
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
        <Card className="overflow-hidden shadow-sm">
          <Table aria-label="Utility Bills Table">
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-sm">Utility & Consumer #</TableHead>
                <TableHead className="font-bold text-sm">Unit & Resident</TableHead>
                <TableHead className="font-bold text-sm">Month & Due Date</TableHead>
                <TableHead className="font-bold text-sm">Amount & Status</TableHead>
                <TableHead className="text-right font-bold text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => {
                const badge = getUtilityBadge(bill.utilityType);
                const Icon = badge.icon;

                return (
                  <TableRow 
                    key={bill.id}
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setActiveInspectorBill(bill)}
                  >
                    
                    {/* Column 1: Utility Type & Consumer ID */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge variant={badge.variant}>
                          <Icon className="w-3.5 h-3.5" />
                          <span>{badge.label}</span>
                        </Badge>
                      </div>
                      <span className="font-mono font-bold text-slate-900 text-sm block">
                        {bill.consumerNumber}
                      </span>
                    </TableCell>

                    {/* Column 2: Unit & Property */}
                    <TableCell>
                      <span className="font-bold text-slate-900 block text-sm">{bill.unitName}</span>
                      <span className="text-sm text-slate-500 font-semibold mt-0.5 block">{bill.tenantName}</span>
                    </TableCell>

                    {/* Column 3: Month & Due Date */}
                    <TableCell>
                      <span className="font-bold text-slate-900 block text-sm">{bill.monthPeriod}</span>
                      <span className="text-sm text-slate-500 font-medium block">Due: {bill.dueDate || '15th of month'}</span>
                    </TableCell>

                    {/* Column 4: Amount & Clearance Status */}
                    <TableCell>
                      <span className="text-base font-black text-slate-950 block">
                        Rs. {bill.amount.toLocaleString()}
                      </span>
                      <div className="mt-1">
                        {bill.paidStatus === 'PAID' ? (
                          <Badge variant="emerald">
                            <CheckCircle className="w-3 h-3" />
                            <span>Cleared</span>
                          </Badge>
                        ) : (
                          <Badge variant="amber" className="animate-pulse">
                            <Clock className="w-3 h-3" />
                            <span>Pending Proof</span>
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Column 5: Action */}
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-bold text-sm h-8 px-3"
                        onClick={() => setActiveInspectorBill(bill)}
                      >
                        <span>View Bill</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 text-amber-500" />
                      </Button>
                    </TableCell>

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Slide-Over Utility Inspector Drawer (`Sheet`) */}
      <Sheet open={!!activeInspectorBill} onOpenChange={(open) => { if (!open) setActiveInspectorBill(null); }}>
        {activeInspectorBill && (
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            
            <SheetHeader className="pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <Badge variant={getUtilityBadge(activeInspectorBill.utilityType).variant}>
                  {getUtilityBadge(activeInspectorBill.utilityType).label}
                </Badge>
                <span className="text-sm font-mono font-bold text-slate-500">ID: {activeInspectorBill.consumerNumber}</span>
              </div>
              <SheetTitle className="text-xl font-black text-slate-900">
                {getUtilityBadge(activeInspectorBill.utilityType).label} Bill: Rs. {activeInspectorBill.amount.toLocaleString()}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-1.5 text-slate-700 font-medium text-sm mt-1">
                <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{activeInspectorBill.unitName} • {activeInspectorBill.monthPeriod}</span>
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 my-5 text-sm text-slate-800">
              
              {/* Primary Action Card */}
              {activeInspectorBill.paidStatus === 'PENDING' ? (
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 shadow-lg border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-base text-white">Action Required: Bill Clearance</span>
                    </div>
                    <Badge variant="amber">Proof Pending</Badge>
                  </div>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    Tenant proof of utility payment is pending for <strong>{activeInspectorBill.monthPeriod}</strong>. Verify the paid slip and mark as cleared to update the property audit.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                    <Button
                      variant="emerald"
                      className="w-full sm:flex-1 font-bold text-base h-12"
                      onClick={() => {
                        updateUtilityBill(activeInspectorBill.id, {
                          paidStatus: 'PAID',
                          verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        });
                        setActiveInspectorBill(null);
                      }}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      <span>Mark Bill Paid & Cleared</span>
                    </Button>

                    {onOpenWhatsAppWithMessage && (
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto font-bold text-base h-12 bg-white border-slate-700 text-slate-900 hover:bg-slate-100"
                        onClick={() => {
                          onOpenWhatsAppWithMessage(
                            `Hello ${activeInspectorBill.tenantName}, kindly upload your paid ${getUtilityBadge(activeInspectorBill.utilityType).label} bill photo for ${activeInspectorBill.monthPeriod} (${activeInspectorBill.unitName}) to complete monthly utility audit. Thank you.`,
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
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-700" />
                      <span className="font-bold text-base text-emerald-950">Utility Bill Cleared & Audited</span>
                    </div>
                    <Badge variant="emerald">Cleared</Badge>
                  </div>
                  <p className="text-sm text-emerald-900 font-medium">
                    This bill of <strong>Rs. {activeInspectorBill.amount.toLocaleString()}</strong> has been audited and cleared for <strong>{activeInspectorBill.monthPeriod}</strong>.
                  </p>
                </div>
              )}

              {/* Bill Details Breakdown */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Consumer Account & Tariff</span>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-600 font-medium block">Assigned Resident:</span>
                    <strong className="text-slate-900 block">{activeInspectorBill.tenantName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium block">Consumer Account ID:</span>
                    <strong className="text-slate-900 font-mono block">{activeInspectorBill.consumerNumber}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Billing Cycle:</span>
                    <span className="font-bold text-slate-900">{activeInspectorBill.monthPeriod}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Due Date:</span>
                    <span className="font-bold text-slate-900">{activeInspectorBill.dueDate || '15th of month'}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                    <span>Gross Bill Amount:</span>
                    <span className="text-lg font-black text-slate-950">
                      Rs. {activeInspectorBill.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attached Paid Bill Photo if any */}
              {activeInspectorBill.billSlipUrl && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Attached Paid Bill Proof / Bank Stamp
                  </span>
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-1.5">
                    <img 
                      src={activeInspectorBill.billSlipUrl} 
                      alt="Paid utility receipt" 
                      className="w-full h-64 object-contain rounded-lg bg-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Danger Zone: Delete Bill */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <Button
                  variant="ghost"
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this utility record?')) {
                      deleteUtilityBill(activeInspectorBill.id);
                      setActiveInspectorBill(null);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  <span>Delete Bill Record</span>
                </Button>
              </div>

            </div>

          </SheetContent>
        )}
      </Sheet>

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
