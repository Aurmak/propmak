'use client';

import React, { useState } from 'react';
import { 
  Receipt, 
  Wallet, 
  FileSpreadsheet, 
  Zap, 
  TrendingUp, 
  Download, 
  Plus 
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { RentRollView } from '../rent/RentRollView';
import { CashDrawerModal } from '../cash/CashDrawerModal';
import { OverseasStatementModal } from '../landlords/OverseasStatementModal';
import { UtilityTracker } from '../utilities/UtilityTracker';
import { DepositSettlementModal } from './DepositSettlementModal';
import { usePropMAK } from '../../context/PropMAKContext';

interface FinanceHubProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

export const FinanceHub: React.FC<FinanceHubProps> = ({
  onOpenWhatsAppWithMessage
}) => {
  const { units, transactions, utilityBills, cashDrawer, assignTenantToUnit } = usePropMAK();
  const [subTab, setSubTab] = useState<'rent-roll' | 'cash-safe' | 'landlords' | 'utilities'>('rent-roll');
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);

  const pendingVerification = transactions.filter(t => t.status === 'PENDING_VERIFICATION').length;
  const pendingUtilities = utilityBills.filter(u => u.paidStatus === 'PENDING').length;

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Top Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Finance & Accounting Hub
              </h1>
              <Badge variant="secondary">
                Unified Ledger
              </Badge>
            </div>
            <p className="text-sm text-slate-700 font-medium mt-1">
              Consolidated financial operations: Monthly rent rolls, bank transfer verification, field cashbook, and overseas landlord statements
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettlementModalOpen(true)}
              className="border-slate-300 font-bold"
            >
              <Receipt className="w-4 h-4 text-amber-600 mr-1.5" />
              <span>Move-Out Deposit Settlement</span>
            </Button>
          </div>
        </div>

        {/* Sub-Navigation Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-sm overflow-x-auto mt-4">
            <Button
              size="sm"
              variant={subTab === 'rent-roll' ? 'default' : 'ghost'}
              onClick={() => setSubTab('rent-roll')}
              className="h-9 font-bold"
            >
              <Receipt className="w-4 h-4 mr-1.5" />
              <span>Rent Roll</span>
              {pendingVerification > 0 && (
                <span className="ml-1.5 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs">
                  {pendingVerification}
                </span>
              )}
            </Button>

            <Button
              size="sm"
              variant={subTab === 'cash-safe' ? 'default' : 'ghost'}
              onClick={() => setSubTab('cash-safe')}
              className="h-9 font-bold"
            >
              <Wallet className="w-4 h-4 mr-1.5" />
              <span>Cash Safe (Rs. {(cashDrawer.cashInHand / 1000).toFixed(0)}k)</span>
            </Button>

            <Button
              size="sm"
              variant={subTab === 'landlords' ? 'default' : 'ghost'}
              onClick={() => setSubTab('landlords')}
              className="h-9 font-bold"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              <span>Landlord Payouts</span>
            </Button>

            <Button
              size="sm"
              variant={subTab === 'utilities' ? 'default' : 'ghost'}
              onClick={() => setSubTab('utilities')}
              className="h-9 font-bold"
            >
              <Zap className="w-4 h-4 mr-1.5" />
              <span>Utility Audits</span>
              {pendingUtilities > 0 && (
                <span className="ml-1.5 px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-xs">
                  {pendingUtilities}
                </span>
              )}
            </Button>
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
