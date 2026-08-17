'use client';

import React, { useState } from 'react';
import { usePropMAK } from '../../context/PropMAKContext';
import { PredictiveAlert } from '../../types';
import { cn } from '@/lib/utils';

interface PredictiveRadarProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

const HEADING = '#1B2559';

const TYPE_LABEL: Record<PredictiveAlert['type'], string> = {
  EXPIRY_SOON: 'Lease expiry',
  ESCALATION_DUE: 'Rent escalation',
  VACANCY_LOSS: 'Vacancy loss',
  APPROVAL_BOTTLENECK: 'Approval needed',
  UTILITY_MISSING: 'Utility missing',
};

const SEVERITY_PILL: Record<PredictiveAlert['severity'], string> = {
  CRITICAL: 'bg-rose-500 text-white',
  WARNING: 'bg-amber-500 text-white',
  INFO: 'bg-blue-500 text-white',
};

const SEVERITY_DOT: Record<PredictiveAlert['severity'], string> = {
  CRITICAL: 'bg-rose-500',
  WARNING: 'bg-amber-500',
  INFO: 'bg-blue-500',
};

export const PredictiveRadar: React.FC<PredictiveRadarProps> = ({
  onOpenWhatsAppWithMessage
}) => {
  const { alerts, approveTicket } = usePropMAK();
  const [resolvedAlerts, setResolvedAlerts] = useState<string[]>([]);
  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'CRITICAL' | 'EXPIRIES' | 'ESCALATIONS'>('ALL');

  const visibleAlerts = alerts.filter(a => {
    if (resolvedAlerts.includes(a.id)) return false;
    if (activeTabFilter === 'CRITICAL') return a.severity === 'CRITICAL';
    if (activeTabFilter === 'EXPIRIES') return a.type === 'EXPIRY_SOON';
    if (activeTabFilter === 'ESCALATIONS') return a.type === 'ESCALATION_DUE';
    return true;
  });

  const handleAction = (alert: PredictiveAlert) => {
    if (alert.type === 'APPROVAL_BOTTLENECK') {
      approveTicket('tkt_201');
      setResolvedAlerts(prev => [...prev, alert.id]);
    } else if (alert.whatsappMessage && onOpenWhatsAppWithMessage) {
      onOpenWhatsAppWithMessage(alert.whatsappMessage, alert.contactNumber);
      setResolvedAlerts(prev => [...prev, alert.id]);
    } else {
      setResolvedAlerts(prev => [...prev, alert.id]);
    }
  };

  const filterOptions: { id: typeof activeTabFilter; label: string; count?: number }[] = [
    { id: 'ALL', label: 'All', count: alerts.length },
    { id: 'CRITICAL', label: 'Critical' },
    { id: 'EXPIRIES', label: 'Expiries' },
    { id: 'ESCALATIONS', label: 'Escalations' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(30,42,90,0.07)] overflow-hidden">

      {/* Header / tab bar — pale blue band like the reference's Requests sub-nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-[#EEF1FA]">
        <h2 className="text-[15px] font-bold" style={{ color: HEADING }}>Needs your attention</h2>
        <div className="flex items-center gap-5">
          {filterOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setActiveTabFilter(opt.id)}
              className={cn(
                'text-[13px] font-medium pb-1 cursor-pointer transition-colors flex items-center gap-1.5 border-b-2',
                activeTabFilter === opt.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              )}
            >
              {opt.label}
              {typeof opt.count === 'number' && opt.count > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{opt.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Entries */}
      {visibleAlerts.length === 0 ? (
        <div className="px-5 py-10 text-center text-[13px] text-slate-500">Nothing under this filter.</div>
      ) : (
        visibleAlerts.map((alert) => (
          <div key={alert.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 last:border-b-0">
            <div className="flex items-start gap-3 min-w-0">
              <span className={cn('w-2 h-2 rounded-full mt-2 shrink-0', SEVERITY_DOT[alert.severity])} />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', SEVERITY_PILL[alert.severity])}>
                    {TYPE_LABEL[alert.type]}
                  </span>
                  {alert.metricValue && <span className="text-[12px] text-slate-400">{alert.metricValue}</span>}
                </div>
                <h3 className="text-[14px] font-semibold" style={{ color: HEADING }}>{alert.title}</h3>
                <p className="text-[13px] text-slate-500 mt-0.5 leading-relaxed">{alert.description}</p>
              </div>
            </div>

            <button
              onClick={() => handleAction(alert)}
              className="text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 cursor-pointer transition-colors shrink-0 self-start sm:self-center"
            >
              {alert.actionLabel}
            </button>
          </div>
        ))
      )}

    </div>
  );
};
