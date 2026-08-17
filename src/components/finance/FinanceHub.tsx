'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Wallet,
  FileSpreadsheet,
  Zap,
  Download,
  Plus,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { RentRollView } from '../rent/RentRollView';
import { CashDrawerModal } from '../cash/CashDrawerModal';
import { OverseasStatementModal } from '../landlords/OverseasStatementModal';
import { UtilityTracker } from '../utilities/UtilityTracker';
import { DepositSettlementModal } from './DepositSettlementModal';
import { BuildingCostsTracker } from './BuildingCostsTracker';
import { DepositLedger } from './DepositLedger';
import { usePropMAK } from '../../context/PropMAKContext';
import { cn } from '@/lib/utils';

interface FinanceHubProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

const HEADING = '#1B2559';

type SubTab = 'rent-roll' | 'cash-safe' | 'landlords' | 'utilities' | 'building-costs' | 'deposits';

export const FinanceHub: React.FC<FinanceHubProps> = ({
  onOpenWhatsAppWithMessage
}) => {
  const { units, transactions, utilityBills, cashDrawer, buildingExpenses, depositRecords, assignTenantToUnit } = usePropMAK();
  const [subTab, setSubTab] = useState<SubTab>('rent-roll');
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);

  const pendingVerification = transactions.filter(t => t.status === 'PENDING_VERIFICATION').length;
  const pendingUtilities = utilityBills.filter(u => u.paidStatus === 'PENDING').length;
  const pendingExpenses = buildingExpenses.filter(e => e.paidStatus === 'PENDING').length;
  const heldDeposits = depositRecords.filter(d => d.status === 'HELD').length;

  const subTabs: { id: SubTab; label: string; icon: React.ElementType; count: number; countVariant: 'amber' | 'rose' | 'slate' }[] = [
    { id: 'rent-roll', label: 'Rent Roll', icon: Receipt, count: pendingVerification, countVariant: 'amber' },
    { id: 'cash-safe', label: `Cash Safe (Rs. ${(cashDrawer.cashInHand / 1000).toFixed(0)}k)`, icon: Wallet, count: 0, countVariant: 'slate' },
    { id: 'landlords', label: 'Landlord Payouts', icon: FileSpreadsheet, count: 0, countVariant: 'slate' },
    { id: 'utilities', label: 'Utility Audits', icon: Zap, count: pendingUtilities, countVariant: 'rose' },
    { id: 'building-costs', label: 'Building Costs', icon: ShieldCheck, count: pendingExpenses, countVariant: 'amber' },
    { id: 'deposits', label: 'Deposits & Advances', icon: KeyRound, count: heldDeposits, countVariant: 'slate' },
  ];

  const countBubbleClass: Record<'amber' | 'rose' | 'slate', string> = {
    amber: 'bg-amber-500 text-white',
    rose: 'bg-rose-500 text-white',
    slate: 'bg-slate-300 text-slate-700'
  };

  return (
    <div className="space-y-6 text-slate-800">

      {/* Top Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: HEADING }}>
                Finance & Accounting Hub
              </h1>
              <Badge variant="secondary">
                Unified Ledger
              </Badge>
            </div>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Consolidated financial operations: Monthly rent rolls, bank transfer verification, field cashbook, and overseas landlord statements
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettlementModalOpen(true)}
              className="font-bold bg-white"
            >
              <Receipt className="w-4 h-4 text-slate-500 mr-1.5" />
              <span>Move-Out Deposit Settlement</span>
            </Button>
          </div>
        </div>

        {/* Sub-Navigation Switcher — contained track, distinct from status badges; wraps on narrower widths so tabs never overflow off-screen invisibly */}
        <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 mt-4">
          {subTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className={cn(
                  'text-[13px] px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap',
                  isActive ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={cn(
                    'min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center',
                    isActive ? 'bg-blue-600/15 text-blue-700' : countBubbleClass[tab.countVariant]
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Sub-View Content */}
      <div className="animate-in fade-in">
        {subTab === 'rent-roll' && (
          <RentRollView onOpenWhatsAppWithMessage={onOpenWhatsAppWithMessage} />
        )}
        {subTab === 'cash-safe' && (
          <CashDrawerModal onOpenWhatsAppWithMessage={onOpenWhatsAppWithMessage} />
        )}
        {subTab === 'landlords' && (
          <OverseasStatementModal onOpenWhatsAppWithMessage={onOpenWhatsAppWithMessage} />
        )}
        {subTab === 'utilities' && (
          <UtilityTracker onOpenWhatsAppWithMessage={onOpenWhatsAppWithMessage} />
        )}
        {subTab === 'building-costs' && (
          <BuildingCostsTracker />
        )}
        {subTab === 'deposits' && (
          <DepositLedger onOpenWhatsAppWithMessage={onOpenWhatsAppWithMessage} />
        )}
      </div>

      {/* Move-Out Deposit Settlement Modal */}
      {isSettlementModalOpen && (
        <DepositSettlementModal
          units={units}
          utilityBills={utilityBills}
          isOpen={isSettlementModalOpen}
          onClose={() => setIsSettlementModalOpen(false)}
          onConfirmSettlement={(settlement) => {
            console.log('Deposit Settled:', settlement);
          }}
          onOpenWhatsApp={onOpenWhatsAppWithMessage}
        />
      )}

    </div>
  );
};
