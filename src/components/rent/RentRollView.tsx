'use client';

import React, { useState } from 'react';
import { 
  Receipt, 
  CheckCircle, 
  Clock, 
  Check, 
  MessageSquare, 
  FileCheck,
  Smartphone,
  User,
  FileText,
  Building2,
  ArrowRight,
  Eye,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { PaymentTransaction } from '../../types';
import { EmptyState } from '../ui/EmptyState';
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

interface RentRollViewProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

export const RentRollView: React.FC<RentRollViewProps> = ({ 
  onOpenWhatsAppWithMessage 
}) => {
  const { transactions, verifyTransaction, searchQuery, setSearchQuery } = usePropMAK();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedTxForSheet, setSelectedTxForSheet] = useState<PaymentTransaction | null>(null);

  const filteredTransactions = transactions.filter(tx => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = tx.receiptNumber.toLowerCase().includes(q) ||
        tx.unitName.toLowerCase().includes(q) ||
        tx.tenantName.toLowerCase().includes(q) ||
        tx.propertyName.toLowerCase().includes(q) ||
        (tx.bankName && tx.bankName.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PENDING') return tx.status === 'PENDING_VERIFICATION';
    if (statusFilter === 'VERIFIED') return tx.status === 'VERIFIED';
    return true;
  });

  const totalCollected = transactions
    .filter(t => t.status === 'VERIFIED')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingVerificationCount = transactions
    .filter(t => t.status === 'PENDING_VERIFICATION').length;

  return (
    <div className="space-y-6 text-slate-900 text-sm animate-in fade-in">
      
      {/* Top Ledger Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Rent Roll & Collections Ledger
              </h1>
              <Badge variant="emerald">
                Rs. {(totalCollected / 100000).toFixed(1)}L Verified
              </Badge>
              {pendingVerificationCount > 0 && (
                <Badge variant="amber" className="animate-pulse">
                  {pendingVerificationCount} Slips Pending
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Monthly rent collection roll: Bank transfers, digital receipts, and overseas wire reconciliation
            </p>
          </div>
        </div>
      </Card>

      {/* Filter Toolbar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto text-sm">
            {[
              { id: 'ALL', label: `All Collections (${transactions.length})` },
              { id: 'PENDING', label: `Pending Slips (${pendingVerificationCount})` },
              { id: 'VERIFIED', label: 'Verified & Cleared' }
            ].map(tab => (
              <Button
                key={tab.id}
                size="sm"
                variant={statusFilter === tab.id ? 'default' : 'ghost'}
                onClick={() => setStatusFilter(tab.id)}
                className="h-9 px-3.5 text-sm font-bold whitespace-nowrap cursor-pointer"
              >
                {tab.label}
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
              placeholder="Search receipt, tenant, or unit..."
              className="pl-9 h-9 text-sm bg-white font-medium"
            />
          </div>

        </div>
      </Card>

      {/* Streamlined 5-Column Rent Roll Table */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No rent transactions found"
          description="No rent receipts or pending slips match your current filter."
          actionLabel="Reset Filter"
          onAction={() => {
            setStatusFilter('ALL');
            setSearchQuery('');
          }}
        />
      ) : (
        <Card className="overflow-hidden shadow-sm">
          <Table aria-label="Monthly Rent Roll Ledger">
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-sm">Receipt Ref</TableHead>
                <TableHead className="font-bold text-sm">Unit & Resident</TableHead>
                <TableHead className="font-bold text-sm">Period & Method</TableHead>
                <TableHead className="font-bold text-sm">Amount & Status</TableHead>
                <TableHead className="text-right font-bold text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow 
                  key={tx.id}
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setSelectedTxForSheet(tx)}
                >
                  
                  {/* Column 1: Receipt Number & Ingest Channel */}
                  <TableCell className="font-mono font-bold text-slate-900 text-sm">
                    <div className="flex items-center gap-1.5">
                      <span>{tx.receiptNumber}</span>
                      {tx.source === 'WHATSAPP_AUTO_INGEST' ? (
                        <span title="Inbound via WhatsApp" className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 shrink-0">
                          <MessageSquare className="w-3 h-3" aria-label="WhatsApp" />
                        </span>
                      ) : tx.source === 'MOBILE_APP_UPLOAD' ? (
                        <span title="Uploaded via Resident App" className="inline-flex items-center justify-center w-5 h-5 rounded bg-blue-100 border border-blue-300 text-blue-800 shrink-0">
                          <Smartphone className="w-3 h-3" aria-label="Resident App" />
                        </span>
                      ) : tx.source === 'FIELD_COLLECTOR' ? (
                        <span title="Field Cash Collector" className="inline-flex items-center justify-center w-5 h-5 rounded bg-amber-100 border border-amber-300 text-amber-800 shrink-0">
                          <User className="w-3 h-3" aria-label="Field Collector" />
                        </span>
                      ) : (
                        <span title="Direct Agency Entry" className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-100 border border-slate-300 text-slate-700 shrink-0">
                          <FileText className="w-3 h-3" aria-label="Desk Entry" />
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Column 2: Unit & Property */}
                  <TableCell>
                    <span className="font-bold text-slate-900 block text-sm">{tx.unitName}</span>
                    <span className="text-sm text-slate-600 font-medium block">{tx.propertyName}</span>
                    <span className="text-sm text-slate-500 font-semibold mt-0.5 block">{tx.tenantName}</span>
                  </TableCell>

                  {/* Column 3: Period & Method */}
                  <TableCell>
                    <span className="font-bold text-slate-900 block text-sm">{tx.monthPeriod}</span>
                    <div className="mt-1">
                      {tx.method === 'BANK_TRANSFER' ? (
                        <Badge variant="blue">Bank Wire</Badge>
                      ) : (
                        <Badge variant="purple">Cash Collection</Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Column 4: Amount & Status */}
                  <TableCell>
                    <span className="text-base font-black text-slate-950 block">
                      Rs. {tx.amount.toLocaleString()}
                    </span>
                    <div className="mt-1">
                      {tx.status === 'VERIFIED' ? (
                        <Badge variant="emerald">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified</span>
                        </Badge>
                      ) : (
                        <Badge variant="amber" className="animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>Slip Pending</span>
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
                      onClick={() => setSelectedTxForSheet(tx)}
                    >
                      <span>Inspect Slip</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 text-amber-500" />
                    </Button>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Slide-Over Rent Transaction Inspector Drawer (`Sheet`) */}
      <Sheet open={!!selectedTxForSheet} onOpenChange={(open) => { if (!open) setSelectedTxForSheet(null); }}>
        {selectedTxForSheet && (
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            
            <SheetHeader className="pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <Badge variant={selectedTxForSheet.status === 'VERIFIED' ? 'emerald' : 'amber'}>
                  {selectedTxForSheet.status === 'VERIFIED' ? 'Verified & Credited' : 'Pending Verification'}
                </Badge>
                <span className="text-sm font-mono font-bold text-slate-500">{selectedTxForSheet.receiptNumber}</span>
              </div>
              <SheetTitle className="text-xl font-black text-slate-900">
                Rent Collection: Rs. {selectedTxForSheet.amount.toLocaleString()}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-1.5 text-slate-700 font-medium text-sm mt-1">
                <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{selectedTxForSheet.unitName} • {selectedTxForSheet.propertyName}</span>
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 my-5 text-sm text-slate-800">
              
              {/* Primary Action Card */}
              {selectedTxForSheet.status === 'PENDING_VERIFICATION' ? (
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 shadow-lg border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-base text-white">Action Required: Verify Slip</span>
                    </div>
                    <Badge variant="amber">Slip Attached</Badge>
                  </div>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    Review the bank wire screenshot below against agency records. Once verified, this amount will be officially credited to the rent roll ledger.
                  </p>
                  <Button
                    variant="emerald"
                    className="w-full font-black text-base h-12 shadow-md"
                    onClick={() => {
                      verifyTransaction(selectedTxForSheet.id);
                      setSelectedTxForSheet(null);
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    <span>Confirm & Verify Slip (Credit Rent Roll)</span>
                  </Button>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-700" />
                      <span className="font-bold text-base text-emerald-950">Payment Verified & Settled</span>
                    </div>
                    <Badge variant="emerald">Settled</Badge>
                  </div>
                  <p className="text-sm text-emerald-900 font-medium">
                    This receipt is verified and credited to <strong>{selectedTxForSheet.monthPeriod}</strong> rent roll ledger.
                  </p>
                  
                  {onOpenWhatsAppWithMessage && (
                    <Button
                      variant="outline"
                      className="w-full font-bold text-sm h-10 bg-white border-emerald-300 text-emerald-950 hover:bg-emerald-100"
                      onClick={() => {
                        onOpenWhatsAppWithMessage(
                          `Hello ${selectedTxForSheet.tenantName}, your rent payment of Rs. ${selectedTxForSheet.amount.toLocaleString()} for ${selectedTxForSheet.monthPeriod} (${selectedTxForSheet.unitName}) has been received & verified. Receipt Ref: ${selectedTxForSheet.receiptNumber}. Thank you.`,
                          selectedTxForSheet.tenantPhone
                        );
                      }}
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600 mr-2" />
                      <span>Send Official Receipt Confirmation</span>
                    </Button>
                  )}
                </div>
              )}

              {/* Transaction Summary Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Transaction Ledger Breakdown</span>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-600 font-medium block">Payer / Resident:</span>
                    <strong className="text-slate-900 block">{selectedTxForSheet.tenantName}</strong>
                    <span className="text-slate-500 text-sm font-mono">{selectedTxForSheet.tenantPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium block">Rental Month:</span>
                    <strong className="text-slate-900 block">{selectedTxForSheet.monthPeriod}</strong>
                    <span className="text-slate-500 text-sm">Due on 1st of month</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Channel / Method:</span>
                    <span className="font-bold text-slate-900">
                      {selectedTxForSheet.method === 'BANK_TRANSFER' ? 'Bank Digital Wire' : 'Cash Deposit'}
                    </span>
                  </div>
                  {selectedTxForSheet.bankName && (
                    <div className="flex justify-between text-slate-600">
                      <span>Receiving Bank / Account:</span>
                      <span className="font-bold text-slate-900">{selectedTxForSheet.bankName}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                    <span>Total Amount Credited:</span>
                    <span className="text-lg font-black text-emerald-700">
                      Rs. {selectedTxForSheet.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attached Wire Transfer Screenshot */}
              {selectedTxForSheet.slipImageUrl && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Attached Wire Transfer Screenshot / Slip
                  </span>
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-1.5">
                    <img 
                      src={selectedTxForSheet.slipImageUrl} 
                      alt="Bank wire transfer slip" 
                      className="w-full h-72 object-contain rounded-lg bg-slate-900"
                    />
                  </div>
                </div>
              )}

            </div>

          </SheetContent>
        )}
      </Sheet>

    </div>
  );
};
