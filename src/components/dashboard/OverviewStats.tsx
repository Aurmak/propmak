'use client';

import React from 'react';
import { MoreHorizontal, ArrowUp, ArrowDown } from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { DonutRing } from '../ui/DonutRing';

const HEADING = '#1B2559';
const CARD = 'bg-white rounded-2xl shadow-[0_2px_16px_rgba(30,42,90,0.07)]';

const Delta: React.FC<{ value: string; up: boolean }> = ({ value, up }) => (
  <span className={`inline-flex items-center gap-0.5 text-[12px] font-semibold ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
    {value} {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
  </span>
);

const ProgressBar: React.FC<{ percent: number; color: string }> = ({ percent, color }) => (
  <div className="h-1.5 rounded-full bg-slate-100 w-full overflow-hidden">
    <div className="h-full rounded-full" style={{ width: `${Math.min(100, percent)}%`, background: color }} />
  </div>
);

export const OverviewStats: React.FC = () => {
  const { units, transactions, tickets, cashDrawer, alerts } = usePropMAK();

  const totalUnits = units.length;
  const rentedUnits = units.filter(u => u.status === 'RENTED_DIRECT' || u.status === 'RENTED_BY_OWNER' || u.status === 'SOLD_CONVERTED_TO_RENT').length;
  const vacantUnits = units.filter(u => u.status === 'VACANT_FOR_RENT').length;
  const occupancyPercent = totalUnits > 0 ? Math.round((rentedUnits / totalUnits) * 100) : 0;

  const monthlyRentRoll = units
    .filter(u => u.status === 'RENTED_DIRECT' || u.status === 'SOLD_CONVERTED_TO_RENT')
    .reduce((sum, u) => sum + (u.monthlyRent || 0), 0);

  const collectedThisMonth = transactions
    .filter(t => t.status === 'VERIFIED')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingVerification = transactions
    .filter(t => t.status === 'PENDING_VERIFICATION')
    .reduce((sum, t) => sum + t.amount, 0);

  const collectedPercent = monthlyRentRoll > 0 ? Math.round(collectedThisMonth / monthlyRentRoll * 100) : 0;
  const pendingPercent = monthlyRentRoll > 0 ? Math.round(pendingVerification / monthlyRentRoll * 100) : 0;

  const activeTicketsCount = tickets.filter(t => t.status !== 'COMPLETED').length;
  const pendingApprovalsCount = tickets.filter(t => t.status === 'LANDLORD_APPROVAL_REQUIRED').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

      {/* Wide: Rent Roll — mirrors the "Requests" 3-stat card */}
      <div className={`${CARD} p-5 lg:col-span-2`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold" style={{ color: HEADING }}>Rent Roll</h3>
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="text-[13px] text-slate-500">Monthly rent roll</div>
            <div className="text-xl font-bold mt-0.5" style={{ color: HEADING }}>Rs. {(monthlyRentRoll / 100000).toFixed(2)}L</div>
            <div className="mt-2.5"><ProgressBar percent={100} color="#2563EB" /></div>
            <div className="mt-1.5"><Delta value={`${totalUnits} units`} up /></div>
          </div>
          <div>
            <div className="text-[13px] text-slate-500">Collected this month</div>
            <div className="text-xl font-bold mt-0.5" style={{ color: HEADING }}>Rs. {(collectedThisMonth / 100000).toFixed(2)}L</div>
            <div className="mt-2.5"><ProgressBar percent={collectedPercent} color="#10B981" /></div>
            <div className="mt-1.5"><Delta value={`${collectedPercent}% verified`} up /></div>
          </div>
          <div>
            <div className="text-[13px] text-slate-500">Pending verification</div>
            <div className="text-xl font-bold mt-0.5" style={{ color: HEADING }}>Rs. {(pendingVerification / 1000).toFixed(0)}k</div>
            <div className="mt-2.5"><ProgressBar percent={pendingPercent} color="#F59E0B" /></div>
            <div className="mt-1.5"><Delta value={`${pendingPercent}% of roll`} up={false} /></div>
          </div>
        </div>
      </div>

      {/* Occupancy donut — mirrors the "Finance" ring card */}
      <div className={`${CARD} p-5 flex items-center gap-5`}>
        <DonutRing percent={occupancyPercent} color="#2563EB" label="rented" />
        <div>
          <h3 className="text-[15px] font-bold" style={{ color: HEADING }}>Occupancy</h3>
          <div className="text-[13px] text-slate-500 mt-2">{rentedUnits}/{totalUnits} units rented</div>
          <div className="text-[13px] text-slate-500 mt-1">{vacantUnits} vacant</div>
        </div>
      </div>

      {/* Cash in hand — mirrors "Communication" stat card */}
      <div className={`${CARD} p-5`}>
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold" style={{ color: HEADING }}>Cash in hand</h3>
        </div>
        <div className="text-2xl font-bold mt-2" style={{ color: HEADING }}>Rs. {cashDrawer.cashInHand.toLocaleString()}</div>
        <div className="text-[13px] text-slate-500 mt-1">office safe drawer</div>
        <div className="mt-2"><Delta value={`Rs. ${cashDrawer.disbursedToMistrisToday.toLocaleString()} disbursed`} up={false} /></div>
      </div>

      {/* Maintenance — mirrors "Tenants" dual-number card */}
      <div className={`${CARD} p-5`}>
        <h3 className="text-[15px] font-bold" style={{ color: HEADING }}>Maintenance</h3>
        <div className="flex items-center gap-8 mt-3">
          <div>
            <div className="text-2xl font-bold" style={{ color: HEADING }}>{activeTicketsCount}</div>
            <div className="text-[12px] text-slate-500 mt-0.5">Active jobs</div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: HEADING }}>{pendingApprovalsCount}</div>
            <div className="text-[12px] text-slate-500 mt-0.5">Need approval</div>
          </div>
        </div>
      </div>

      {/* Alerts summary — mirrors "Invoices" small card */}
      <div className={`${CARD} p-5`}>
        <h3 className="text-[15px] font-bold" style={{ color: HEADING }}>Predictive alerts</h3>
        <div className="text-2xl font-bold mt-2" style={{ color: HEADING }}>{alerts.length}</div>
        <div className="text-[13px] text-slate-500 mt-1">action items to review</div>
      </div>

    </div>
  );
};
