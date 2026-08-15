'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Receipt, 
  Check, 
  QrCode, 
  MessageSquare, 
  Banknote
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';

interface CashDrawerModalProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

export const CashDrawerModal: React.FC<CashDrawerModalProps> = ({ 
  onOpenWhatsAppWithMessage 
}) => {
  const { units, cashDrawer, recordCashPayment, depositCashDrawer } = usePropMAK();
  
  const [selectedUnitId, setSelectedUnitId] = useState<string>(units[0]?.id || '');
  const [amount, setAmount] = useState<number>(85000);
  const [monthPeriod, setMonthPeriod] = useState<string>('August 2026');
  const [collectorName, setCollectorName] = useState<string>('Munshi Akram (Field Agent)');
  const [notes, setNotes] = useState<string>('Cash received on-site at Central Boulevard.');
  
  const [latestReceiptNo, setLatestReceiptNo] = useState<string | null>(null);

  const handleSubmitCash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitId || amount <= 0) return;

    const receiptNo = recordCashPayment({
      unitId: selectedUnitId,
      amount,
      monthPeriod,
      collectedBy: collectorName,
      notes
    });

    setLatestReceiptNo(receiptNo);
  };

  const selectedUnit = units.find(u => u.id === selectedUnitId);

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header Banner */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Field Cash Operations & Safe Drawer
              </h1>
              <Badge variant="amber">
                Institutional Cash Management
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              On-site cash collections, digital QR-verified receipts, and end-of-day bank reconciliations
            </p>
          </div>

          {/* Safe Balance Card */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-200 text-sm text-right">
              <span className="text-xs text-slate-500 block font-bold uppercase">Cash in Safe Drawer</span>
              <span className="text-2xl font-extrabold text-slate-900">Rs. {cashDrawer.cashInHand.toLocaleString()}</span>
            </div>

            <Button
              onClick={depositCashDrawer}
              disabled={cashDrawer.cashInHand === 0}
              variant="default"
            >
              <Banknote className="w-4 h-4 text-amber-400" />
              <span>Deposit to Bank</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Grid: Collection Form + Digital Receipt Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Record Cash Entry Form (5 cols) */}
        <Card className="lg:col-span-5 p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Record Field Cash Collection</h2>
              <p className="text-xs text-slate-500 font-medium">Collect cash & generate instant digital proof</p>
            </div>
          </div>

          <form onSubmit={handleSubmitCash} className="space-y-4 text-sm">
            
            {/* Unit Picker */}
            <div>
              <label className="block text-slate-700 font-bold mb-1 text-xs">Select Property / Unit</label>
              <select
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium focus:outline-none focus:border-slate-800"
              >
                {units.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.unitNumber} — {u.propertyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-slate-700 font-bold mb-1 text-xs">Cash Amount (PKR)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rs.</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="pl-12 text-lg font-extrabold"
                  required
                />
              </div>
            </div>

            {/* Month & Collector */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-xs">Billing Month</label>
                <Input
                  type="text"
                  value={monthPeriod}
                  onChange={(e) => setMonthPeriod(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-xs">Collected By</label>
                <Input
                  type="text"
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-slate-700 font-bold mb-1 text-xs">Collection Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
            >
              <Receipt className="w-4 h-4 text-amber-400" />
              <span>Collect Rs. {amount.toLocaleString()} & Generate Receipt</span>
            </Button>

          </form>
        </Card>

        {/* Right Column: Branded Digital PDF Receipt (7 cols) */}
        <Card className="lg:col-span-7 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-900 text-base">Digital Cash Receipt Preview (Official)</h2>
            </div>
            <Badge variant="emerald">
              Official Cash Voucher
            </Badge>
          </div>

          {/* Paper Styled Receipt Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-800 shadow-2xs space-y-4">
            
            {/* Top Receipt Bar */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">PROPMAK</span>
                  <Badge variant="secondary">
                    Cash Receipt
                  </Badge>
                </div>
                <p className="text-sm font-medium text-slate-600 mt-1">PROPMAK Real Estate Management • Operations Division</p>
              </div>

              <div className="text-right">
                <span className="font-mono text-sm font-bold text-slate-900 block">
                  {latestReceiptNo || 'REC-2026-0808'}
                </span>
                <span className="text-sm text-slate-500 font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Receipt Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-500 uppercase block font-bold">Received From (Tenant)</span>
                <span className="font-bold text-slate-900">{selectedUnit?.renter?.name || 'Hamza Javed (Retail)'}</span>
                <span className="text-xs text-slate-500 block">{selectedUnit?.renter?.phone || '+1 (555) 567-8901'}</span>
              </div>

              <div>
                <span className="text-xs text-slate-500 uppercase block font-bold">Property / Demise</span>
                <span className="font-bold text-slate-900">{selectedUnit?.unitNumber}</span>
                <span className="text-xs text-slate-500 block">{selectedUnit?.propertyName}</span>
              </div>

              <div>
                <span className="text-xs text-slate-500 uppercase block font-bold">For Period / Month</span>
                <span className="font-semibold text-slate-800">{monthPeriod}</span>
              </div>

              <div>
                <span className="text-xs text-slate-500 uppercase block font-bold">Payment Channel</span>
                <span className="font-semibold text-emerald-700">Cash-in-Hand (Field Collection)</span>
              </div>
            </div>

            {/* Amount Box */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block uppercase font-bold">Total Amount Received</span>
                <span className="text-2xl font-extrabold text-slate-900">Rs. {amount.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 justify-end">
                  <Check className="w-4 h-4" /> PAID IN CASH
                </span>
                <span className="text-xs text-slate-500">Collected by: {collectorName.split(' ')[0]}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <QrCode className="w-4 h-4 text-slate-400" />
                <span>Scan QR for digital verification</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="emerald"
                  onClick={() => {
                    if (onOpenWhatsAppWithMessage) {
                      onOpenWhatsAppWithMessage(
                        `Hello, your cash rent payment of Rs. ${amount.toLocaleString()} for ${monthPeriod} (${selectedUnit?.unitNumber}) has been collected by ${collectorName}. Official Receipt Ref: ${latestReceiptNo || 'REC-2026-0808'}. Thank you.`,
                        selectedUnit?.renter?.whatsapp || selectedUnit?.renter?.phone
                      );
                    }
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Receipt via WhatsApp</span>
                </Button>
              </div>
            </div>

          </div>

        </Card>

      </div>

    </div>
  );
};
