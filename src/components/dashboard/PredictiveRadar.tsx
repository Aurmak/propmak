'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  ShieldAlert, 
  Zap, 
  MessageSquare, 
  PhoneCall
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { PredictiveAlert } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface PredictiveRadarProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

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

  return (
    <Card className="p-6 text-slate-800">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 text-amber-900 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Predictive Operations Radar
              </h2>
              <Badge variant="amber">
                Proactive Intelligence
              </Badge>
            </div>
            <p className="text-sm text-slate-700 font-medium mt-0.5">
              Automated alerts for upcoming lease expirations, 10% rent increments, and void revenue losses
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-sm">
          <Button
            size="sm"
            variant={activeTabFilter === 'ALL' ? 'default' : 'ghost'}
            onClick={() => setActiveTabFilter('ALL')}
            className="font-bold"
          >
            All ({alerts.length})
          </Button>
          <Button
            size="sm"
            variant={activeTabFilter === 'CRITICAL' ? 'destructive' : 'ghost'}
            onClick={() => setActiveTabFilter('CRITICAL')}
            className="font-bold"
          >
            Critical
          </Button>
          <Button
            size="sm"
            variant={activeTabFilter === 'EXPIRIES' ? 'default' : 'ghost'}
            onClick={() => setActiveTabFilter('EXPIRIES')}
            className="font-bold"
          >
            Expiries
          </Button>
          <Button
            size="sm"
            variant={activeTabFilter === 'ESCALATIONS' ? 'emerald' : 'ghost'}
            onClick={() => setActiveTabFilter('ESCALATIONS')}
            className="font-bold"
          >
            10% Escalations
          </Button>
        </div>
      </div>

      {/* Radar Cards Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleAlerts.map((alert) => {
          return (
            <div
              key={alert.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-sm ${
                alert.severity === 'CRITICAL'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : alert.severity === 'WARNING'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {alert.type === 'EXPIRY_SOON' && (
                      <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-900">
                        <Clock className="w-4 h-4" />
                      </span>
                    )}
                    {alert.type === 'ESCALATION_DUE' && (
                      <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-900">
                        <TrendingUp className="w-4 h-4" />
                      </span>
                    )}
                    {alert.type === 'VACANCY_LOSS' && (
                      <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
                        <ShieldAlert className="w-4 h-4" />
                      </span>
                    )}
                    {alert.type === 'APPROVAL_BOTTLENECK' && (
                      <span className="p-1.5 rounded-lg bg-rose-100 text-rose-900">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                    )}
                    {alert.type === 'UTILITY_MISSING' && (
                      <span className="p-1.5 rounded-lg bg-blue-100 text-blue-900">
                        <Zap className="w-4 h-4" />
                      </span>
                    )}

                    <span className="text-sm font-bold uppercase tracking-wider text-slate-800">
                      {alert.type.replace('_', ' ')}
                    </span>
                  </div>

                  {alert.metricValue && (
                    <Badge variant="outline" className="bg-white">
                      {alert.metricValue}
                    </Badge>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug">
                  {alert.title}
                </h3>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed font-medium">
                  {alert.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3.5 border-t border-black/5 flex items-center justify-between gap-2">
                {alert.contactNumber && (
                  <span className="text-sm text-slate-800 font-mono flex items-center gap-1 font-bold">
                    <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                    {alert.contactNumber.split(' ')[0]}...
                  </span>
                )}

                <Button
                  size="sm"
                  onClick={() => handleAction(alert)}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>{alert.actionLabel}</span>
                </Button>
              </div>

            </div>
          );
        })}
      </div>

    </Card>
  );
};
