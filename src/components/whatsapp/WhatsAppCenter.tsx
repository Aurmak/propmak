'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCheck, 
  ExternalLink
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';

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
      <div className="bg-white border border-[#E7E5E4] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif-editorial text-2xl font-bold text-[#1B365D] tracking-tight">
              WhatsApp Automation & Messaging Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#25D366]/15 text-[#1EBE5D] text-xs font-bold border border-[#25D366]/30">
              WhatsApp-First Pakistan
            </span>
          </div>
          <p className="text-xs text-[#78716C] mt-0.5">
            Instant 1-click WhatsApp triggers: 1st of the month rent alerts, digital payment receipts, landlord repair approvals, and mistri work orders
          </p>
        </div>

        <button
          onClick={handleOpenDirectWhatsApp}
          className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Launch WhatsApp Web / App</span>
        </button>
      </div>

      {/* Main Grid: Templates & Live Chat Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Quick Automation Templates (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider block">
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
              className="p-3.5 rounded-xl bg-white border border-[#E7E5E4] hover:border-[#1B365D] cursor-pointer transition-all text-xs group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1B365D] group-hover:text-[#FF8A00] transition-colors">
                  {tpl.title}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#F9F7F3] text-[#78716C] font-semibold border border-[#E7E5E4]">
                  {tpl.target}
                </span>
              </div>
              <p className="text-[11px] text-[#78716C] mt-1.5 line-clamp-2 leading-relaxed">{tpl.msg}</p>
            </div>
          ))}
        </div>

        {/* Right Column: Interactive WhatsApp Phone Simulator (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E7E5E4] rounded-2xl p-6 shadow-xs space-y-4">
          
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
          <div className="bg-[#EFEAE2] p-4 rounded-xl border border-[#E7E5E4] space-y-3 h-64 overflow-y-auto text-xs">
            {messageHistory.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'AGENCY' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed shadow-2xs ${
                    m.sender === 'AGENCY'
                      ? 'bg-[#DCF8C6] text-[#2F3E46] rounded-tr-none'
                      : 'bg-white text-[#2F3E46] rounded-tl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-[#78716C]">
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
                className="bg-[#F9F7F3] border border-[#E7E5E4] rounded-lg px-2.5 py-1.5 text-[#2F3E46] text-xs"
              />
              <input
                type="text"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="Phone Number (e.g. +923214455888)"
                className="bg-[#F9F7F3] border border-[#E7E5E4] rounded-lg px-2.5 py-1.5 text-[#2F3E46] text-xs font-mono"
              />
            </div>

            <div className="flex gap-2">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={2}
                placeholder="Type your WhatsApp message..."
                className="flex-1 bg-[#F9F7F3] border border-[#E7E5E4] rounded-xl p-2.5 text-[#2F3E46] text-xs focus:outline-none focus:border-[#25D366] resize-none"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
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
