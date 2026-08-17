'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCheck, 
  ExternalLink
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

const HEADING = '#1B2559';
const CARD = 'bg-white rounded-2xl shadow-[0_2px_16px_rgba(30,42,90,0.07)]';

interface WhatsAppCenterProps {
  initialMessage?: string;
  initialPhone?: string;
}

export const WhatsAppCenter: React.FC<WhatsAppCenterProps> = ({
  initialMessage,
  initialPhone
}) => {
  const { units } = usePropMAK();
  
  const [recipientPhone, setRecipientPhone] = useState<string>(initialPhone || '+923214455888');
  const [recipientName, setRecipientName] = useState<string>('Khurram Shahzad (Tenant - DHA 5)');
  const [messageText, setMessageText] = useState<string>(
    initialMessage || 
    'Assalam-o-Alaikum Khurram Sahib, your rent of Rs. 160,000 for August 2026 (Ground Floor 42-A DHA 5) is due. Kindly transfer via Raast to IBAN: PK88SCBL00000011223344 and upload your transfer screenshot. Thank you.'
  );

  const [messageHistory, setMessageHistory] = useState<Array<{
    sender: 'AGENCY' | 'TENANT' | 'LANDLORD';
    text: string;
    time: string;
  }>>([
    {
      sender: 'AGENCY',
      text: 'Assalam-o-Alaikum Khurram Sahib, your rent of Rs. 160,000 for August 2026 is due. Kindly transfer via Raast.',
      time: '09:00 AM'
    },
    {
      sender: 'TENANT',
      text: 'Walaikum Assalam. Just transferred Rs. 160,000 from Meezan Bank. Uploading slip on PropMAK.',
      time: '10:15 AM'
    },
    {
      sender: 'AGENCY',
      text: 'Receipt confirmed! Official Receipt #REC-2026-0812 has been credited to your tenancy ledger. JazakAllah.',
      time: '10:18 AM'
    }
  ]);

  const handleSendMessage = () => {
    if (!messageText) return;
    
    setMessageHistory(prev => [
      ...prev,
      {
        sender: 'AGENCY',
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleOpenDirectWhatsApp = () => {
    const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(messageText);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner */}
      <div className={cn(CARD, 'p-6 flex flex-col md:flex-row md:items-center justify-between gap-4')}>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold" style={{ color: HEADING }}>
              WhatsApp Automation & Messaging Hub
            </h1>
            <Badge variant="emerald">WhatsApp-First Pakistan</Badge>
          </div>
          <p className="text-[13px] text-slate-500 mt-1">
            Instant 1-click WhatsApp triggers: 1st of the month rent alerts, digital payment receipts, landlord repair approvals, and mistri work orders
          </p>
        </div>

        <button
          onClick={handleOpenDirectWhatsApp}
          className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Launch WhatsApp Web / App</span>
        </button>
      </div>

      {/* Main Grid: Templates & Live Chat Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Quick Automation Templates (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide block">
            Pre-Built Pakistan WhatsApp Templates
          </span>

          {[
            {
              title: '1st of Month Rent Due Alert',
              target: 'Tenant',
              msg: 'Assalam-o-Alaikum [Tenant], your rent of Rs. [Amount] for [Month] ([Unit]) is due by [Date]. Please transfer to IBAN: PK88SCBL... and reply with your screenshot.'
            },
            {
              title: 'Verified Rent Payment Receipt',
              target: 'Tenant & Owner',
              msg: 'Payment Received! Rs. [Amount] credited for [Month]. Download your official PropMAK verified receipt: https://propmak.pk/rec/[Ref]'
            },
            {
              title: 'Overseas Landlord 1-Tap Cost Approval',
              target: 'Landlord (UK/Gulf)',
              msg: '🛠️ Urgent Repair: Water pump capacitor burnt at [Unit]. Mistri Estimate: Rs. 11,000. Please reply 1 to APPROVE or tap link: https://propmak.pk/appr/[ID]'
            },
            {
              title: 'Mistri Job Assignment with Address',
              target: 'Mistri / Ustaad',
              msg: 'Ustaad Rafiq, new work order for Water Pump at House 42-A DHA Phase 5. Tenant phone: +92 321 4455888. Please visit today.'
            },
            {
              title: '10% Annual Rent Escalation Notice',
              target: 'Tenant',
              msg: 'Dear [Tenant], as per your tenancy contract, the 10% annual rent escalation is due from [Month]. Your revised monthly rent is Rs. [NewAmount].'
            }
          ].map((tpl, idx) => (
            <div
              key={idx}
              onClick={() => setMessageText(tpl.msg)}
              className={cn(CARD, 'p-3.5 hover:shadow-[0_4px_20px_rgba(30,42,90,0.12)] cursor-pointer transition-all text-xs group')}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold group-hover:text-blue-600 transition-colors" style={{ color: HEADING }}>
                  {tpl.title}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-500 font-semibold">
                  {tpl.target}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{tpl.msg}</p>
            </div>
          ))}
        </div>

        {/* Right Column: Interactive WhatsApp Phone Simulator (7 cols) */}
        <div className={cn(CARD, 'lg:col-span-7 p-6 space-y-4')}>
          
          {/* Top WhatsApp Chat Bar */}
          <div className="p-3.5 bg-[#075E54] text-white rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white text-[#075E54] flex items-center justify-center font-bold text-xs">
                KS
              </div>
              <div>
                <span className="font-bold text-white block">{recipientName}</span>
                <span className="text-[10px] text-emerald-200 font-mono">{recipientPhone}</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-100 bg-black/20 px-2 py-0.5 rounded font-semibold">
              Online
            </span>
          </div>

          {/* Chat Messages Stream */}
          <div className="bg-[#EFEAE2] p-4 rounded-xl space-y-3 h-64 overflow-y-auto text-xs">
            {messageHistory.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'AGENCY' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed shadow-2xs ${
                    m.sender === 'AGENCY'
                      ? 'bg-[#DCF8C6] text-slate-800 rounded-tr-none'
                      : 'bg-white text-slate-800 rounded-tl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-slate-400">
                    <span>{m.time}</span>
                    {m.sender === 'AGENCY' && <CheckCheck className="w-3 h-3 text-[#34B7F1]" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Composer Box */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Recipient Name"
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
              <input
                type="text"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="Phone Number (e.g. +923214455888)"
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div className="flex gap-2">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={2}
                placeholder="Type your WhatsApp message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-[#25D366] resize-none"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
