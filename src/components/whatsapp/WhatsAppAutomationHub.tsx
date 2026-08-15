'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Wrench, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Search,
  Check,
  User,
  Building2,
  Camera,
  FileText,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { WhatsAppIngestedMessage } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../ui/table';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '../ui/sheet';
import { EmptyState } from '../ui/EmptyState';

interface WhatsAppAutomationHubProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

export const WhatsAppAutomationHub: React.FC<WhatsAppAutomationHubProps> = ({
  onOpenWhatsAppWithMessage
}) => {
  const { whatsAppIngestEvents, setActiveTab } = usePropMAK();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [activeInspectorMessage, setActiveInspectorMessage] = useState<WhatsAppIngestedMessage | null>(null);

  const filteredEvents = whatsAppIngestEvents.filter(evt => {
    if (search) {
      const q = search.toLowerCase();
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
          <div className="flex items-center gap-2 overflow-x-auto text-sm">
            {[
              { id: 'ALL', label: `All Inbound (${whatsAppIngestEvents.length})` },
              { id: 'REPAIRS', label: 'Repair Reports', icon: Wrench },
              { id: 'SLIPS', label: 'Rent Slips', icon: Receipt },
              { id: 'APPROVALS', label: 'Landlord Approvals', icon: CheckCircle2 }
            ].map(tab => (
              <Button
                key={tab.id}
                size="sm"
                variant={filterType === tab.id ? 'default' : 'ghost'}
                onClick={() => setFilterType(tab.id)}
                className="h-9 px-3.5 text-sm font-bold whitespace-nowrap cursor-pointer"
              >
                {tab.icon && <tab.icon className="w-4 h-4 mr-1.5" />}
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sender, unit, or message..."
              className="pl-9 h-9 text-sm bg-white font-medium"
            />
          </div>

        </div>
      </Card>

      {/* Inbound Messages Clean High-Density Data Table */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No inbound messages found"
          description="Incoming repair requests, rent transfer slips, and landlord authorizations will appear here."
          actionLabel="Reset Message Filter"
          onAction={() => {
            setFilterType('ALL');
            setSearch('');
          }}
        />
      ) : (
        <Card className="overflow-hidden shadow-sm">
          <Table aria-label="Inbound Activity Table">
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-sm">Type & Channel</TableHead>
                <TableHead className="font-bold text-sm">Sender & Demise</TableHead>
                <TableHead className="font-bold text-sm">Message Content</TableHead>
                <TableHead className="font-bold text-sm">Attachment</TableHead>
                <TableHead className="font-bold text-sm">Received</TableHead>
                <TableHead className="text-right font-bold text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((evt) => (
                <TableRow 
                  key={evt.id}
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setActiveInspectorMessage(evt)}
                >
                  {/* Column 1: Channel & Type */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span title="Inbound Message" className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 shrink-0">
                        <MessageSquare className="w-3.5 h-3.5" aria-label="WhatsApp Channel" />
                      </span>
                      {getEventBadge(evt.actionTaken)}
                    </div>
                  </TableCell>

                  {/* Column 2: Sender & Demise */}
                  <TableCell>
                    <div className="font-bold text-slate-900 text-sm">{evt.senderName}</div>
                    <div className="text-sm text-slate-500 font-medium">
                      {evt.matchedUnitName ? (
                        <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
                          <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{evt.matchedUnitName}</span>
                        </span>
                      ) : (
                        <span>{evt.senderPhone}</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Column 3: Message Preview */}
                  <TableCell className="max-w-md">
                    <span className="font-medium text-slate-800 text-sm block truncate">
                      &quot;{evt.rawMessageText}&quot;
                    </span>
                  </TableCell>

                  {/* Column 4: Attachment */}
                  <TableCell>
                    {evt.mediaUrl ? (
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        <Camera className="w-3.5 h-3.5 text-slate-600" />
                        <span>Photo / Slip</span>
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400 font-medium">—</span>
                    )}
                  </TableCell>

                  {/* Column 5: Received Timestamp */}
                  <TableCell className="font-mono text-sm text-slate-600 font-medium whitespace-nowrap">
                    {evt.timestamp}
                  </TableCell>

                  {/* Column 6: Action */}
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-bold text-sm h-8 px-3"
                      onClick={() => setActiveInspectorMessage(evt)}
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 text-amber-500" />
                    </Button>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Slide-Over Inbound Message Inspector Drawer (`Sheet`) */}
      <Sheet open={!!activeInspectorMessage} onOpenChange={(open) => { if (!open) setActiveInspectorMessage(null); }}>
        {activeInspectorMessage && (
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            
            <SheetHeader className="pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 shrink-0">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </span>
                  {getEventBadge(activeInspectorMessage.actionTaken)}
                </div>
                <span className="text-sm font-mono text-slate-500 font-bold">{activeInspectorMessage.timestamp}</span>
              </div>
              <SheetTitle className="text-xl font-black text-slate-900">
                Inbound Message from {activeInspectorMessage.senderName}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-1.5 text-slate-700 font-medium text-sm mt-1">
                <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{activeInspectorMessage.matchedUnitName || 'Direct Contact'} • {activeInspectorMessage.senderPhone}</span>
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 my-5 text-sm text-slate-800">
              
              {/* Contextual Primary Action Banner */}
              {activeInspectorMessage.actionTaken === 'TICKET_AUTO_CREATED' && (
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 shadow-lg border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-base text-white">Maintenance Issue Logged</span>
                    </div>
                    <Badge variant="amber">Awaiting Review</Badge>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    This issue has been ingested into the Issues Pipeline. Open the Issues Hub to assign a specialist mistri and enter the repair quote.
                  </p>
                  <Button
                    variant="default"
                    className="w-full font-black text-base h-12 bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md"
                    onClick={() => {
                      setActiveTab('issues');
                      setActiveInspectorMessage(null);
                    }}
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    <span>Open in Issues Pipeline & Assign Mistri</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {activeInspectorMessage.actionTaken === 'PAYMENT_SLIP_ATTACHED' && (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-emerald-700" />
                      <span className="font-bold text-base text-emerald-950">Payment Slip Attached</span>
                    </div>
                    <Badge variant="emerald">Verification Pending</Badge>
                  </div>
                  <p className="text-sm text-emerald-900 leading-relaxed font-medium">
                    The payment transfer screenshot has been attached to the Rent Roll ledger. Open Rent Roll to verify the bank wire.
                  </p>
                  <Button
                    variant="emerald"
                    className="w-full font-black text-base h-12 shadow-sm"
                    onClick={() => {
                      setActiveTab('rent');
                      setActiveInspectorMessage(null);
                    }}
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    <span>Verify Slip in Rent Roll Ledger</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {activeInspectorMessage.actionTaken === 'QUOTE_APPROVED' && (
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-base text-blue-950">Landlord Quote Authorized</span>
                    </div>
                    <Badge variant="blue">Authorized</Badge>
                  </div>
                  <p className="text-sm text-blue-900 leading-relaxed font-medium">
                    The overseas property owner approved the maintenance estimate. Physical work order can proceed.
                  </p>
                  <Button
                    variant="default"
                    className="w-full font-bold text-base h-12 bg-slate-900 text-white hover:bg-slate-800"
                    onClick={() => {
                      setActiveTab('issues');
                      setActiveInspectorMessage(null);
                    }}
                  >
                    <span>View Work Order in Issues Hub</span>
                    <ArrowRight className="w-4 h-4 ml-2 text-amber-400" />
                  </Button>
                </div>
              )}

              {/* Inbound Message Bubble */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Raw Inbound Text</span>
                <p className="text-slate-900 leading-relaxed font-medium text-base">
                  &quot;{activeInspectorMessage.rawMessageText}&quot;
                </p>
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
                  <span>Sender: <strong className="text-slate-800">{activeInspectorMessage.senderName}</strong></span>
                  <span className="font-mono">{activeInspectorMessage.senderPhone}</span>
                </div>
              </div>

              {/* Photo / Screenshot Preview */}
              {activeInspectorMessage.mediaUrl && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Attached Photo / Payment Slip</span>
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-1.5">
                    <img 
                      src={activeInspectorMessage.mediaUrl} 
                      alt="Inbound attachment" 
                      className="w-full h-56 object-cover rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Automated Response Sent */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  ✅ Automated Confirmation Dispatched
                </span>
                <p className="text-sm font-semibold text-emerald-950 leading-relaxed">
                  {activeInspectorMessage.replySent}
                </p>
              </div>

              {/* Direct Reply Button */}
              {onOpenWhatsAppWithMessage && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full font-bold text-base h-12 bg-white border-slate-300 text-slate-900 hover:bg-slate-50"
                    onClick={() => {
                      onOpenWhatsAppWithMessage(
                        `Hello ${activeInspectorMessage.senderName}, following up regarding your message.`,
                        activeInspectorMessage.senderPhone
                      );
                    }}
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600 mr-2" />
                    <span>Reply Directly to {activeInspectorMessage.senderName}</span>
                  </Button>
                </div>
              )}

            </div>

          </SheetContent>
        )}
      </Sheet>

    </div>
  );
};
