'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Wrench,
  Receipt,
  CheckCircle2,
  ArrowRight,
  Search,
  Building2,
  Camera
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { WhatsAppIngestedMessage } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EmptyState } from '../ui/EmptyState';
import { cn } from '@/lib/utils';

const HEADING = '#1B2559';

interface WhatsAppAutomationHubProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

export const WhatsAppAutomationHub: React.FC<WhatsAppAutomationHubProps> = ({
  onOpenWhatsAppWithMessage
}) => {
  const { whatsAppIngestEvents, setActiveTab, searchQuery, setSearchQuery } = usePropMAK();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const filteredEvents = whatsAppIngestEvents.filter(evt => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = evt.senderName.toLowerCase().includes(q) ||
        evt.senderPhone.toLowerCase().includes(q) ||
        evt.rawMessageText.toLowerCase().includes(q) ||
        (evt.matchedUnitName && evt.matchedUnitName.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (filterType === 'REPAIRS') return evt.actionTaken === 'TICKET_AUTO_CREATED';
    if (filterType === 'SLIPS') return evt.actionTaken === 'PAYMENT_SLIP_ATTACHED';
    if (filterType === 'APPROVALS') return evt.actionTaken === 'QUOTE_APPROVED';
    return true;
  });

  const selectedMessage = filteredEvents.find(evt => evt.id === selectedMessageId) || filteredEvents[0] || null;

  const getEventBadge = (action: WhatsAppIngestedMessage['actionTaken']) => {
    switch (action) {
      case 'TICKET_AUTO_CREATED':
        return (
          <Badge variant="destructive">
            <Wrench className="w-3.5 h-3.5 mr-1" />
            <span>Repair Report</span>
          </Badge>
        );
      case 'PAYMENT_SLIP_ATTACHED':
        return (
          <Badge variant="emerald">
            <Receipt className="w-3.5 h-3.5 mr-1" />
            <span>Payment Slip</span>
          </Badge>
        );
      case 'QUOTE_APPROVED':
        return (
          <Badge variant="blue">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            <span>Landlord Approval</span>
          </Badge>
        );
      default:
        return <Badge variant="purple">System Bot</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-slate-900 text-sm animate-in fade-in">
      
      {/* Top Search & Filter Toolbar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Filter Tabs */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {[
              { id: 'ALL', label: `All Inbound (${whatsAppIngestEvents.length})` },
              { id: 'REPAIRS', label: 'Repair Reports', icon: Wrench },
              { id: 'SLIPS', label: 'Rent Slips', icon: Receipt },
              { id: 'APPROVALS', label: 'Landlord Approvals', icon: CheckCircle2 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-[13px] whitespace-nowrap transition-colors flex items-center cursor-pointer',
                  filterType === tab.id ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700'
                )}
              >
                {tab.icon && <tab.icon className="w-3.5 h-3.5 mr-1.5" />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, unit, or message..."
              className="pl-9 h-9 text-sm bg-white font-medium"
            />
          </div>

        </div>
      </Card>

      {/* Master-Detail: Inbound Message List + Message Inspector */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No inbound messages found"
          description="Incoming repair requests, rent transfer slips, and landlord authorizations will appear here."
          actionLabel="Reset Message Filter"
          onAction={() => {
            setFilterType('ALL');
            setSearchQuery('');
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row" style={{ minHeight: '560px' }}>

            {/* LEFT: message list */}
            <div className="w-full sm:w-[340px] shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {filteredEvents.map((evt) => {
                const isSelected = selectedMessage?.id === evt.id;
                return (
                  <button
                    key={evt.id}
                    onClick={() => setSelectedMessageId(evt.id)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 border-b border-l-4 border-slate-100 cursor-pointer transition-colors block',
                      isSelected ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 shrink-0">
                        <MessageSquare className="w-3 h-3" />
                      </span>
                      <span className="text-[12px] text-slate-500 font-mono">{evt.timestamp}</span>
                    </div>
                    <div className="text-[14px] font-semibold truncate" style={{ color: isSelected ? '#2563EB' : HEADING }}>{evt.senderName}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5 truncate">
                      {evt.matchedUnitName ? (
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{evt.matchedUnitName}</span>
                        </span>
                      ) : (
                        <span>{evt.senderPhone}</span>
                      )}
                    </div>
                    <div className="text-[12px] text-slate-500 mt-1 truncate italic">&quot;{evt.rawMessageText}&quot;</div>
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      {getEventBadge(evt.actionTaken)}
                      {evt.mediaUrl && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                          <Camera className="w-3 h-3 text-slate-500" />
                          <span>Photo</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: detail panel */}
            <div className="flex-1 min-w-0 p-6 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {selectedMessage && (
                <div className="space-y-6">

                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 shrink-0">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </span>
                        {getEventBadge(selectedMessage.actionTaken)}
                      </div>
                      <span className="text-sm font-mono text-slate-500 font-bold">{selectedMessage.timestamp}</span>
                    </div>
                    <h2 className="text-lg font-bold" style={{ color: HEADING }}>
                      Inbound Message from {selectedMessage.senderName}
                    </h2>
                    <p className="text-[13px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {selectedMessage.matchedUnitName || 'Direct Contact'} • {selectedMessage.senderPhone}
                    </p>
                  </div>

                  {/* Contextual Primary Action Banner */}
                  {selectedMessage.actionTaken === 'TICKET_AUTO_CREATED' && (
                    <div className="p-5 rounded-2xl bg-amber-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wrench className="w-5 h-5 text-amber-700" />
                          <span className="font-bold text-base text-amber-900">Maintenance Issue Logged</span>
                        </div>
                        <Badge variant="amber">Awaiting Review</Badge>
                      </div>
                      <p className="text-sm text-amber-900 leading-relaxed font-medium">
                        This issue has been ingested into the Issues Pipeline. Open the Issues Hub to assign a specialist mistri and enter the repair quote.
                      </p>
                      <Button
                        variant="default"
                        className="w-full font-bold text-base h-12"
                        onClick={() => setActiveTab('issues')}
                      >
                        <Wrench className="w-4 h-4 mr-2" />
                        <span>Open in Issues Pipeline & Assign Mistri</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}

                  {selectedMessage.actionTaken === 'PAYMENT_SLIP_ATTACHED' && (
                    <div className="p-5 rounded-2xl bg-emerald-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-5 h-5 text-emerald-700" />
                          <span className="font-bold text-base text-emerald-900">Payment Slip Attached</span>
                        </div>
                        <Badge variant="emerald">Verification Pending</Badge>
                      </div>
                      <p className="text-sm text-emerald-900 leading-relaxed font-medium">
                        The payment transfer screenshot has been attached to the Rent Roll ledger. Open Rent Roll to verify the bank wire.
                      </p>
                      <Button
                        variant="emerald"
                        className="w-full font-bold text-base h-12"
                        onClick={() => setActiveTab('rent')}
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        <span>Verify Slip in Rent Roll Ledger</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}

                  {selectedMessage.actionTaken === 'QUOTE_APPROVED' && (
                    <div className="p-5 rounded-2xl bg-blue-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          <span className="font-bold text-base text-blue-900">Landlord Quote Authorized</span>
                        </div>
                        <Badge variant="blue">Authorized</Badge>
                      </div>
                      <p className="text-sm text-blue-900 leading-relaxed font-medium">
                        The overseas property owner approved the maintenance estimate. Physical work order can proceed.
                      </p>
                      <Button
                        variant="default"
                        className="w-full font-bold text-base h-12"
                        onClick={() => setActiveTab('issues')}
                      >
                        <span>View Work Order in Issues Hub</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}

                  <div className="h-px bg-slate-100" />

                  {/* Inbound Message Bubble */}
                  <div>
                    <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Raw Inbound Text</div>
                    <div className="rounded-xl p-4 space-y-2" style={{ background: '#EEF1FA' }}>
                      <p className="leading-relaxed font-medium text-base" style={{ color: HEADING }}>
                        &quot;{selectedMessage.rawMessageText}&quot;
                      </p>
                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
                        <span>Sender: <strong className="text-slate-700">{selectedMessage.senderName}</strong></span>
                        <span className="font-mono">{selectedMessage.senderPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Photo / Screenshot Preview */}
                  {selectedMessage.mediaUrl && (
                    <div>
                      <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Attached Photo / Payment Slip</div>
                      <div className="rounded-xl overflow-hidden bg-slate-50 p-1.5">
                        <img
                          src={selectedMessage.mediaUrl}
                          alt="Inbound attachment"
                          className="w-full h-56 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  <div className="h-px bg-slate-100" />

                  {/* Automated Response Sent */}
                  <div className="p-4 rounded-xl bg-emerald-50 space-y-1.5">
                    <span className="text-[12px] font-semibold text-emerald-700 uppercase tracking-wide block">
                      Automated Confirmation Dispatched
                    </span>
                    <p className="text-sm font-semibold text-emerald-900 leading-relaxed">
                      {selectedMessage.replySent}
                    </p>
                  </div>

                  {/* Direct Reply Button */}
                  {onOpenWhatsAppWithMessage && (
                    <Button
                      variant="outline"
                      className="w-full font-bold text-base h-12 bg-white"
                      onClick={() => {
                        onOpenWhatsAppWithMessage(
                          `Hello ${selectedMessage.senderName}, following up regarding your message.`,
                          selectedMessage.senderPhone
                        );
                      }}
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600 mr-2" />
                      <span>Reply Directly to {selectedMessage.senderName}</span>
                    </Button>
                  )}

                </div>
              )}
            </div>

          </div>
        </Card>
      )}

    </div>
  );
};
