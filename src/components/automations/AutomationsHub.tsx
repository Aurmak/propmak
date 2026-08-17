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

const HEADING = '#1B2559';

export const AutomationsHub: React.FC = () => {
  const { whatsAppIngestEvents } = usePropMAK();

  return (
    <div className="space-y-6 text-slate-800 animate-in fade-in">

      {/* Top Banner */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold" style={{ color: HEADING }}>
                  Inbound Messages & Action Center
                </h1>
                <Badge variant="emerald">
                  Channels Connected
                </Badge>
              </div>
              <p className="text-[13px] text-slate-500 mt-1">
                Real-time activity feed: Incoming tenant repair requests, payment slips, and landlord authorizations arriving via WhatsApp and the Tenant App
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5" style={{ background: '#EEF1FA', color: HEADING }}>
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
