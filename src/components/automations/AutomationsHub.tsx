'use client';

import React from 'react';
import { 
  MessageSquare, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { WhatsAppAutomationHub } from '../whatsapp/WhatsAppAutomationHub';
import { usePropMAK } from '../../context/PropMAKContext';

export const AutomationsHub: React.FC = () => {
  const { whatsAppIngestEvents } = usePropMAK();

  return (
    <div className="space-y-6 text-slate-800 animate-in fade-in">
      
      {/* Top Banner */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
              <MessageSquare className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Inbound Messages & Action Center
                </h1>
                <Badge variant="emerald">
                  Channels Connected
                </Badge>
              </div>
              <p className="text-sm text-slate-700 font-medium mt-1">
                Real-time activity feed: Incoming tenant repair requests, payment slips, and landlord authorizations arriving via WhatsApp and the Tenant App
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>WhatsApp & App Live</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="animate-in fade-in">
        <WhatsAppAutomationHub />
      </div>

    </div>
  );
};
