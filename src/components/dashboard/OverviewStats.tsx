'use client';

import React from 'react';
import { 
  Building2, 
  Receipt, 
  Wallet, 
  Wrench, 
  AlertCircle, 
  CheckCircle
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

export const OverviewStats: React.FC = () => {
  const { units, transactions, tickets, cashDrawer, alerts } = usePropMAK();

  const totalUnits = units.length;
  const rentedUnits = units.filter(u => u.status === 'RENTED_DIRECT' || u.status === 'RENTED_BY_OWNER' || u.status === 'SOLD_CONVERTED_TO_RENT').length;
  const vacantUnits = units.filter(u => u.status === 'VACANT_FOR_RENT').length;
  const forSaleUnits = units.filter(u => u.status === 'FOR_SALE' || u.status === 'TOKEN_RECEIVED').length;
  
  const monthlyRentRoll = units
    .filter(u => u.status === 'RENTED_DIRECT' || u.status === 'SOLD_CONVERTED_TO_RENT')
    .reduce((sum, u) => sum + (u.monthlyRent || 0), 0);

  const collectedThisMonth = transactions
    .filter(t => t.status === 'VERIFIED')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingVerification = transactions
    .filter(t => t.status === 'PENDING_VERIFICATION')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeTicketsCount = tickets.filter(t => t.status !== 'COMPLETED').length;
  const pendingApprovalsCount = tickets.filter(t => t.status === 'LANDLORD_APPROVAL_REQUIRED').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
      {/* Monthly Rent Roll */}
      <Card className="hover:border-slate-400 transition-all">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Monthly Rent Roll</span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Rs. {(monthlyRentRoll / 100000).toFixed(2)} <span className="text-base font-bold text-amber-700">Lacs</span>
            </div>
            <p className="text-sm text-slate-700 mt-1 flex items-center gap-1.5 font-medium">
              <span className="text-emerald-800 font-bold">Rs. {(collectedThisMonth / 100000).toFixed(2)} Lacs</span>
              <span>verified ({(monthlyRentRoll > 0 ? (collectedThisMonth / monthlyRentRoll * 100).toFixed(0) : 0)}%)</span>
            </p>
          </div>
          {pendingVerification > 0 && (
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
              <span className="text-amber-950 font-bold">Pending Slip Verification:</span>
              <span className="font-extrabold text-amber-900">Rs. {(pendingVerification / 1000).toFixed(0)}k</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 360° Property Occupancy */}
      <Card className="hover:border-slate-400 transition-all">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Portfolio Occupancy</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>{rentedUnits}/{totalUnits}</span>
              <span className="text-sm font-bold text-emerald-800">Rented ({(rentedUnits / totalUnits * 100).toFixed(0)}%)</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Badge variant="amber">{vacantUnits} Vacant</Badge>
              <Badge variant="blue">{forSaleUnits} Sales / Token</Badge>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm text-slate-700">
            <span className="font-medium">Converted to Managed Rental:</span>
            <span className="font-bold text-slate-900">2 Units ("Sold-to-Rent")</span>
          </div>
        </CardContent>
      </Card>

      {/* Agency Cash Drawer */}
      <Card className="hover:border-slate-400 transition-all">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Agency Cash-in-Hand</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Rs. {cashDrawer.cashInHand.toLocaleString()}
            </div>
            <p className="text-sm text-slate-700 mt-1 font-medium">
              Physical cash in office safe drawer
            </p>
          </div>
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
            <span className="text-slate-700 font-medium">Technician Disbursements:</span>
            <span className="font-bold text-rose-800">- Rs. {cashDrawer.disbursedToMistrisToday.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card className="hover:border-slate-400 transition-all">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Maintenance & Repairs</span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>{activeTicketsCount}</span>
              <span className="text-sm font-bold text-slate-800">Active Jobs</span>
            </div>
            <p className="text-sm text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
              {pendingApprovalsCount > 0 ? (
                <span className="text-amber-900 font-bold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  {pendingApprovalsCount} Awaiting Landlord Approval
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> All Quotes Approved
                </span>
              )}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-700 font-medium">Predictive Alerts:</span>
            <span className="font-bold text-amber-800">{alerts.length} Action Items</span>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
