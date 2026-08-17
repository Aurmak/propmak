'use client';

import React, { useState } from 'react';
import {
  Building2,
  CheckCircle,
  Globe,
  Printer,
  MessageSquare
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { LandlordPayout } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '../ui/table';
import { cn } from '@/lib/utils';

const HEADING = '#1B2559';

interface OverseasStatementModalProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

export const OverseasStatementModal: React.FC<OverseasStatementModalProps> = ({
  onOpenWhatsAppWithMessage
}) => {
  const { payouts } = usePropMAK();
  const [selectedPayout, setSelectedPayout] = useState<LandlordPayout>(payouts[0]);

  return (
    <div className="space-y-6 text-slate-800">

      {/* Header Banner */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: HEADING }}>
                Landlord Statements & Net Disbursements
              </h1>
              <Badge variant="emerald">
                Net Disbursement Engine
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Transparent reporting for overseas and local property investors with automated net payout calculations
            </p>
          </div>

          {/* Quick Landlord Selector — contained track, distinct from status badges */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {payouts.map(p => {
              const isActive = selectedPayout.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPayout(p)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-[13px] whitespace-nowrap transition-colors cursor-pointer',
                    isActive ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700'
                  )}
                >
                  {p.landlordName.split(' ')[0]} ({p.landlordCountry.split('(')[1]?.replace(')', '') || 'Investor'})
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Main Statement Document Layout */}
      <Card className="p-6 space-y-5">

        {/* Statement Action Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Globe className="w-4 h-4 text-slate-400" />
            <span>Landlord: <strong className="font-bold" style={{ color: HEADING }}>{selectedPayout.landlordName}</strong> ({selectedPayout.landlordCountry})</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="bg-white"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print PDF</span>
            </Button>

            {onOpenWhatsAppWithMessage && (
              <Button
                size="sm"
                variant="emerald"
                onClick={() => {
                  onOpenWhatsAppWithMessage(
                    `Hello ${selectedPayout.landlordName}, your monthly property management statement for ${selectedPayout.period} has been generated. Gross Rent: Rs. ${selectedPayout.grossRentCollected.toLocaleString()} | Net Payout: Rs. ${selectedPayout.netPayout.toLocaleString()} (${selectedPayout.netPayoutGBP ? `£${selectedPayout.netPayoutGBP.toFixed(2)} GBP` : `$${selectedPayout.netPayoutUSD?.toFixed(2)} USD`}). Statement link: https://propmak.io/stmt/${selectedPayout.id}`,
                    '+447700900123'
                  );
                }}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </Button>
            )}
          </div>
        </div>

        {/* Printable Styled Statement Document */}
        <div className="rounded-2xl p-7 text-slate-800 space-y-6" style={{ background: '#EEF1FA' }}>

          {/* Statement Header */}
          <div className="flex items-start justify-between border-b border-white pb-4 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold" style={{ color: HEADING }}>PROPMAK</span>
                <Badge variant="secondary">
                  Investor Statement
                </Badge>
              </div>
              <p className="text-sm font-medium text-slate-500 mt-1">PROPMAK Real Estate Management • Operations Division</p>
              <p className="text-sm text-slate-500 font-mono">Account ID: PM-8849201</p>
            </div>

            <div className="text-right">
              <span className="text-sm font-mono font-bold block" style={{ color: HEADING }}>Ref: STMT-{selectedPayout.id.toUpperCase()}</span>
              <span className="text-sm font-bold" style={{ color: HEADING }}>{selectedPayout.period}</span>
              <span className="text-xs text-slate-500 block mt-0.5">Date: {selectedPayout.generatedDate}</span>
            </div>
          </div>

          {/* Properties Managed under Statement */}
          <div className="space-y-2 text-sm">
            <span className="font-bold text-slate-500 uppercase text-xs block">Properties in This Disbursement Run</span>
            <div className="p-4 rounded-xl bg-white shadow-[0_1px_4px_rgba(30,42,90,0.08)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-800">
              <div className="flex items-center gap-2 font-medium">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Apartment 402 (Grand Oak Tower) — Rented</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Ground Floor Villa Suite (Palm Gardens) — Rented</span>
              </div>
            </div>
          </div>

          {/* Itemized Accounting Ledger Table */}
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Accounting Line Item</TableHead>
                  <TableHead>Basis / Reference</TableHead>
                  <TableHead className="text-right">Credit / Debit (PKR)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-emerald-50/60 font-bold text-emerald-950">
                  <TableCell>Gross Rental Income Received</TableCell>
                  <TableCell className="font-normal text-slate-500">Total rent collected for August 2026</TableCell>
                  <TableCell className="text-right text-base font-bold text-emerald-700">
                    + Rs. {selectedPayout.grossRentCollected.toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-slate-800">Agency Management Fee</TableCell>
                  <TableCell className="text-slate-500">{selectedPayout.agencyCommissionPercent}% of Gross Monthly Rent</TableCell>
                  <TableCell className="text-right text-rose-700 font-bold">
                    - Rs. {selectedPayout.agencyCommission.toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-slate-800">Approved Maintenance / Repair Costs</TableCell>
                  <TableCell className="text-slate-500">Water pump capacitor & valve repair (Apt 402)</TableCell>
                  <TableCell className="text-right text-rose-700 font-bold">
                    - Rs. {selectedPayout.maintenanceDeductions.toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-slate-800">Building Service Charge / Common Dues</TableCell>
                  <TableCell className="text-slate-500">Security & sanitation service charges</TableCell>
                  <TableCell className="text-right text-rose-700 font-bold">
                    - Rs. {selectedPayout.serviceChargeDeductions.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>

          {/* Net Disbursement Box */}
          <div className="p-5 rounded-xl bg-white shadow-[0_1px_4px_rgba(30,42,90,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold block">Net Landlord Payout (Disbursable)</span>
              <span className="text-3xl font-bold tracking-tight" style={{ color: HEADING }}>
                Rs. {selectedPayout.netPayout.toLocaleString()} PKR
              </span>
            </div>

            <div className="px-5 py-3 rounded-xl text-right" style={{ background: '#EEF1FA' }}>
              <span className="text-xs text-slate-500 block uppercase font-bold">Foreign Currency Equivalent</span>
              <span className="text-xl font-bold text-blue-600">
                {selectedPayout.netPayoutGBP
                  ? `£${selectedPayout.netPayoutGBP.toFixed(2)} GBP`
                  : `$${selectedPayout.netPayoutUSD?.toFixed(2)} USD`}
              </span>
              <span className="text-xs text-slate-500 block font-medium">Bank wire ready</span>
            </div>
          </div>

          {/* Audit Footer */}
          <div className="pt-2 border-t border-white flex items-center justify-between text-sm text-slate-500 flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <CheckCircle className="w-4 h-4" /> Audited & Verified by PROPMAK Agency Ledger
            </span>
            <span className="font-mono text-sm">Account Wire Ref: PK88SCBL00...</span>
          </div>

        </div>

      </Card>

    </div>
  );
};
