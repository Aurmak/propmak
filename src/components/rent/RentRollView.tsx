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
  Search
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { PaymentTransaction } from '../../types';
import { EmptyState } from '../ui/EmptyState';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

const HEADING = '#1B2559';

interface RentRollViewProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

export const RentRollView: React.FC<RentRollViewProps> = ({
  onOpenWhatsAppWithMessage
}) => {
  const { transactions, verifyTransaction, searchQuery, setSearchQuery } = usePropMAK();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

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

  const sourceIconMeta = (source: PaymentTransaction['source']) => {
    if (source === 'WHATSAPP_AUTO_INGEST') return { icon: MessageSquare, label: 'Inbound via WhatsApp' };
    if (source === 'MOBILE_APP_UPLOAD') return { icon: Smartphone, label: 'Uploaded via Resident App' };
    if (source === 'FIELD_COLLECTOR') return { icon: User, label: 'Field Cash Collector' };
    return { icon: FileText, label: 'Direct Agency Entry' };
  };

  const selectedTx = filteredTransactions.find(tx => tx.id === selectedTxId) || filteredTransactions[0] || null;

  return (
    <div className="space-y-6 text-slate-900 text-sm animate-in fade-in">

      {/* Top Ledger Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: HEADING }}>
                Rent Roll & Collections Ledger
              </h1>
              <Badge variant="emerald">
                Rs. {(totalCollected / 100000).toFixed(1)}L Verified
              </Badge>
              {pendingVerificationCount > 0 && (
                <Badge variant="amber">
                  {pendingVerificationCount} Slips Pending
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Monthly rent collection roll: Bank transfers, digital receipts, and overseas wire reconciliation
            </p>
          </div>
        </div>
      </Card>

      {/* Filter Toolbar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

          {/* Status Tabs — contained track, distinct from status badges */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-sm">
            {[
              { id: 'ALL', label: `All Collections (${transactions.length})` },
              { id: 'PENDING', label: `Pending Slips (${pendingVerificationCount})` },
              { id: 'VERIFIED', label: 'Verified & Cleared' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-[13px] whitespace-nowrap transition-colors cursor-pointer',
                  statusFilter === tab.id ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700'
                )}
              >
                {tab.label}
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
              placeholder="Search receipt, tenant, or unit..."
              className="pl-9 h-9 text-sm bg-white font-medium"
            />
          </div>

        </div>
      </Card>

      {/* Master-Detail Rent Roll */}
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
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row" style={{ minHeight: '560px' }}>

            {/* LEFT: transaction list */}
            <div className="w-full sm:w-[340px] shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {filteredTransactions.map((tx) => {
                const source = sourceIconMeta(tx.source);
                const SourceIcon = source.icon;
                const isSelected = selectedTx?.id === tx.id;
                return (
                  <button
                    key={tx.id}
                    onClick={() => setSelectedTxId(tx.id)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 border-b border-l-4 border-slate-100 cursor-pointer transition-colors block',
                      isSelected ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span title={source.label} className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-500 shrink-0">
                        <SourceIcon className="w-2.5 h-2.5" aria-label={source.label} />
                      </span>
                      <span className="text-[12px] font-mono text-slate-500">{tx.receiptNumber}</span>
                    </div>
                    <div className="text-[14px] font-semibold truncate" style={{ color: isSelected ? '#2563EB' : HEADING }}>{tx.unitName}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{tx.tenantName} · Rs. {tx.amount.toLocaleString()}</div>
                    <div className="mt-2">
                      {tx.status === 'VERIFIED' ? (
                        <Badge variant="emerald"><CheckCircle className="w-3 h-3" /><span>Verified</span></Badge>
                      ) : (
                        <Badge variant="amber"><Clock className="w-3 h-3" /><span>Slip Pending</span></Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: detail panel */}
            <div className="flex-1 min-w-0 p-6 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {selectedTx && (
                <div className="space-y-6">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <Badge variant={selectedTx.status === 'VERIFIED' ? 'emerald' : 'amber'}>
                          {selectedTx.status === 'VERIFIED' ? 'Verified & Credited' : 'Pending Verification'}
                        </Badge>
                        <span className="text-[12px] text-slate-400 font-mono">{selectedTx.receiptNumber}</span>
                      </div>
                      <h2 className="text-lg font-bold" style={{ color: HEADING }}>
                        Rent Collection: Rs. {selectedTx.amount.toLocaleString()}
                      </h2>
                      <p className="text-[13px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {selectedTx.unitName} · {selectedTx.propertyName}
                      </p>
                    </div>
                  </div>

                  {/* Primary Action Card */}
                  {selectedTx.status === 'PENDING_VERIFICATION' ? (
                    <div className="p-5 rounded-2xl bg-amber-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-5 h-5 text-amber-700" />
                          <span className="font-bold text-base text-amber-900">Action Required: Verify Slip</span>
                        </div>
                        <Badge variant="amber">Slip Attached</Badge>
                      </div>
                      <p className="text-sm text-amber-800 font-medium leading-relaxed">
                        Review the bank wire screenshot below against agency records. Once verified, this amount will be officially credited to the rent roll ledger.
                      </p>
                      <Button
                        variant="emerald"
                        className="w-full font-bold text-base h-12"
                        onClick={() => {
                          verifyTransaction(selectedTx.id);
                        }}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        <span>Confirm & Verify Slip (Credit Rent Roll)</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-emerald-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-700" />
                          <span className="font-bold text-base text-emerald-950">Payment Verified & Settled</span>
                        </div>
                        <Badge variant="emerald">Settled</Badge>
                      </div>
                      <p className="text-sm text-emerald-900 font-medium">
                        This receipt is verified and credited to <strong>{selectedTx.monthPeriod}</strong> rent roll ledger.
                      </p>

                      {onOpenWhatsAppWithMessage && (
                        <Button
                          variant="outline"
                          className="w-full font-bold text-sm h-10 bg-white hover:bg-emerald-100"
                          onClick={() => {
                            onOpenWhatsAppWithMessage(
                              `Hello ${selectedTx.tenantName}, your rent payment of Rs. ${selectedTx.amount.toLocaleString()} for ${selectedTx.monthPeriod} (${selectedTx.unitName}) has been received & verified. Receipt Ref: ${selectedTx.receiptNumber}. Thank you.`,
                              selectedTx.tenantPhone
                            );
                          }}
                        >
                          <MessageSquare className="w-4 h-4 text-emerald-600 mr-2" />
                          <span>Send Official Receipt Confirmation</span>
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="h-px bg-slate-100" />

                  {/* Transaction Summary */}
                  <div>
                    <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2.5">Transaction ledger breakdown</div>
                    <div className="p-4 rounded-xl space-y-3" style={{ background: '#EEF1FA' }}>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-500 font-medium block">Payer / Resident:</span>
                          <strong className="block" style={{ color: HEADING }}>{selectedTx.tenantName}</strong>
                          <span className="text-slate-500 text-sm font-mono">{selectedTx.tenantPhone}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">Rental Month:</span>
                          <strong className="block" style={{ color: HEADING }}>{selectedTx.monthPeriod}</strong>
                          <span className="text-slate-500 text-sm">Due on 1st of month</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white space-y-1.5 text-sm">
                        <div className="flex justify-between text-slate-600">
                          <span>Payment Channel / Method:</span>
                          <span className="font-bold" style={{ color: HEADING }}>
                            {selectedTx.method === 'BANK_TRANSFER' ? 'Bank Digital Wire' : 'Cash Deposit'}
                          </span>
                        </div>
                        {selectedTx.bankName && (
                          <div className="flex justify-between text-slate-600">
                            <span>Receiving Bank / Account:</span>
                            <span className="font-bold" style={{ color: HEADING }}>{selectedTx.bankName}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-base font-bold pt-2 border-t border-white" style={{ color: HEADING }}>
                          <span>Total Amount Credited:</span>
                          <span className="text-lg font-bold text-emerald-700">
                            Rs. {selectedTx.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attached Wire Transfer Screenshot */}
                  {selectedTx.slipImageUrl && (
                    <>
                      <div className="h-px bg-slate-100" />
                      <div>
                        <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2.5">
                          Attached wire transfer screenshot / slip
                        </div>
                        <div className="rounded-xl overflow-hidden p-1.5" style={{ background: '#EEF1FA' }}>
                          <img
                            src={selectedTx.slipImageUrl}
                            alt="Bank wire transfer slip"
                            className="w-full h-72 object-contain rounded-lg bg-slate-900"
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

    </div>
  );
};
