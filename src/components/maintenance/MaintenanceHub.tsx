'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Droplets,
  Zap,
  Wind,
  Paintbrush,
  Key,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  MessageSquare,
  User,
  Building2,
  Calendar,
  Camera,
  Check,
  Smartphone,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { MaintenanceTicket, TradeCategory, TicketUrgency, TicketStatus } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { EmptyState } from '../ui/EmptyState';
import { AssignContractorModal } from './AssignContractorModal';
import { PlannedMaintenanceCalendar } from './PlannedMaintenanceCalendar';
import { ComboBox } from '../ui/ComboBox';
import { TogglePills } from '../ui/TogglePills';
import { cn } from '@/lib/utils';

interface MaintenanceHubProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

const HEADING = '#1B2559';
const CARD = 'bg-white rounded-2xl shadow-[0_2px_16px_rgba(30,42,90,0.07)]';

const URGENCY_DOT: Record<TicketUrgency, string> = {
  EMERGENCY: 'bg-rose-500',
  STANDARD: 'bg-amber-500',
  LOW: 'bg-slate-300',
};

const URGENCY_LABEL: Record<TicketUrgency, string> = {
  EMERGENCY: 'Emergency',
  STANDARD: 'Standard',
  LOW: 'Low priority',
};

export const MaintenanceHub: React.FC<MaintenanceHubProps> = ({
  onOpenWhatsAppWithMessage
}) => {
  const {
    tickets,
    units,
    approveTicket,
    markJobFinishedByContractor,
    verifyWorkByTenant,
    closeTicketAndMakeInvoicePayable,
    assignContractorToTicket,
    createTicket,
    deleteTicket,
    searchQuery,
    setSearchQuery
  } = usePropMAK();

  const [hubTab, setHubTab] = useState<'issues' | 'planned'>('issues');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [tradeFilter, setTradeFilter] = useState<string>('ALL');
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [assigningTicket, setAssigningTicket] = useState<MaintenanceTicket | null>(null);

  // New Job Form State
  const [newUnitId, setNewUnitId] = useState<string>(units[0]?.id || '');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newCategory, setNewCategory] = useState<TradeCategory>('PLUMBER_PUMP_GEYSER');
  const [newUrgency, setNewUrgency] = useState<TicketUrgency>('STANDARD');

  const filteredTickets = tickets.filter(t => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = t.title.toLowerCase().includes(q) ||
        t.unitName.toLowerCase().includes(q) ||
        t.propertyName.toLowerCase().includes(q) ||
        t.ticketNumber.toLowerCase().includes(q) ||
        t.tenantName.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (tradeFilter !== 'ALL' && t.category !== tradeFilter) return false;

    if (stageFilter === 'ALL') return true;
    if (stageFilter === 'REPORTED') return t.status === 'REPORTED' || !t.assignedMistri;
    if (stageFilter === 'APPROVAL') return t.status === 'LANDLORD_APPROVAL_REQUIRED';
    if (stageFilter === 'IN_PROGRESS') return t.status === 'IN_PROGRESS';
    if (stageFilter === 'VERIFICATION') return t.status === 'AWAITING_TENANT_VERIFICATION' || t.status === 'TENANT_VERIFIED';
    if (stageFilter === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  const selectedTicket = filteredTickets.find(t => t.id === selectedTicketId) || filteredTickets[0] || null;

  const getCategoryMeta = (cat: TradeCategory) => {
    switch (cat) {
      case 'PLUMBER_PUMP_GEYSER':
        return { label: 'Plumbing & Pumps', icon: Droplets, variant: 'blue' as const };
      case 'ELECTRICIAN_UPS':
        return { label: 'Electrical & DB', icon: Zap, variant: 'amber' as const };
      case 'AC_TECHNICIAN':
        return { label: 'HVAC & AC', icon: Wind, variant: 'teal' as const };
      case 'PAINTER_SEEPAGE':
        return { label: 'Painter & Seepage', icon: Paintbrush, variant: 'purple' as const };
      case 'CARPENTER_LOCKS':
        return { label: 'Locks & Carpentry', icon: Key, variant: 'emerald' as const };
      default:
        return { label: 'General Handyman', icon: Wrench, variant: 'secondary' as const };
    }
  };

  const getStatusBadge = (ticket: MaintenanceTicket) => {
    if (ticket.status === 'LANDLORD_APPROVAL_REQUIRED') return <Badge variant="amber">Awaiting approval</Badge>;
    if (ticket.status === 'IN_PROGRESS') return <Badge variant="blue">In progress</Badge>;
    if (ticket.status === 'AWAITING_TENANT_VERIFICATION') return <Badge variant="purple">Awaiting tenant</Badge>;
    if (ticket.status === 'TENANT_VERIFIED') return <Badge variant="teal">Tenant verified</Badge>;
    if (ticket.status === 'REPORTED' || !ticket.assignedMistri) return <Badge variant="secondary">New</Badge>;
    if (ticket.status === 'COMPLETED') return <Badge variant="emerald">{ticket.contractorInvoiceStatus === 'PAYABLE' ? 'Closed · Payable' : 'Resolved'}</Badge>;
    return <Badge variant="secondary">{ticket.status}</Badge>;
  };

  const handleCreateNewJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUnitId) return;

    const id = createTicket({
      unitId: newUnitId,
      title: newTitle,
      description: newDescription,
      category: newCategory,
      urgency: newUrgency,
      materialCost: 0,
      labourCost: 0
    });

    setSelectedTicketId(id);
    setIsNewJobModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const reportedUnassignedCount = tickets.filter(t => t.status === 'REPORTED' || !t.assignedMistri).length;
  const pendingApprovalsCount = tickets.filter(t => t.status === 'LANDLORD_APPROVAL_REQUIRED').length;
  const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const verificationCount = tickets.filter(t => t.status === 'AWAITING_TENANT_VERIFICATION' || t.status === 'TENANT_VERIFIED').length;
  const completedCount = tickets.filter(t => t.status === 'COMPLETED').length;

  const stageTabs: { id: string; label: string; count: number }[] = [
    { id: 'ALL', label: 'All', count: tickets.length },
    { id: 'REPORTED', label: 'New', count: reportedUnassignedCount },
    { id: 'APPROVAL', label: 'Approval', count: pendingApprovalsCount },
    { id: 'IN_PROGRESS', label: 'In progress', count: inProgressCount },
    { id: 'VERIFICATION', label: 'Verification', count: verificationCount },
    { id: 'COMPLETED', label: 'Solved', count: completedCount },
  ];

  const photos = selectedTicket ? [
    { url: selectedTicket.beforePhotoUrl, label: 'Before' },
    { url: selectedTicket.afterPhotoUrl, label: 'After' },
    { url: selectedTicket.receiptPhotoUrl, label: 'Receipt' },
  ].filter(p => p.url) : [];

  return (
    <div className="space-y-6 text-slate-900 text-sm">

      {/* Top Header */}
      <div className={cn(CARD, 'p-6')}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold" style={{ color: HEADING }}>Issues &amp; Maintenance</h1>
              <Badge variant="secondary">{tickets.length} tickets</Badge>
            </div>
            <p className="text-[13px] text-slate-500 mt-1">
              Issue intake, contractor assignment, inspection quotes, and landlord authorizations
            </p>
          </div>

          {hubTab === 'issues' && (
            <Button variant="default" onClick={() => setIsNewJobModalOpen(true)} className="font-bold text-sm">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Report New Issue</span>
            </Button>
          )}
        </div>

        {/* Sub-Navigation Switcher — contained track, distinct from status badges */}
        <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 mt-4">
          <button
            onClick={() => setHubTab('issues')}
            className={cn('px-3.5 py-1.5 rounded-lg text-[13px] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap',
              hubTab === 'issues' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700')}
          >
            <Wrench className="w-3.5 h-3.5" />
            Reactive Issues
            {reportedUnassignedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{reportedUnassignedCount}</span>
            )}
          </button>
          <button
            onClick={() => setHubTab('planned')}
            className={cn('px-3.5 py-1.5 rounded-lg text-[13px] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap',
              hubTab === 'planned' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700')}
          >
            <Calendar className="w-3.5 h-3.5" />
            Planned Maintenance
          </button>
        </div>
      </div>

      {hubTab === 'planned' ? (
        <PlannedMaintenanceCalendar />
      ) : (
        <div className={cn(CARD, 'overflow-hidden')}>

          {/* Status tab bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-5 py-4" style={{ background: '#EEF1FA' }}>
            <div className="flex items-center gap-5 overflow-x-auto">
              {stageTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStageFilter(tab.id)}
                  className={cn(
                    'text-[13px] font-medium pb-1 cursor-pointer transition-colors flex items-center gap-1.5 border-b-2 whitespace-nowrap',
                    stageFilter === tab.id ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700'
                  )}
                >
                  {tab.label}
                  {tab.count > 0 && tab.id !== 'ALL' && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            <select
              value={tradeFilter}
              onChange={(e) => setTradeFilter(e.target.value)}
              className="bg-white border-0 rounded-lg px-3.5 py-1.5 text-[13px] text-slate-700 font-medium focus:outline-none cursor-pointer shadow-[0_1px_4px_rgba(30,42,90,0.08)]"
            >
              <option value="ALL">All trades</option>
              <option value="PLUMBER_PUMP_GEYSER">Plumbing &amp; Water Motors</option>
              <option value="ELECTRICIAN_UPS">Electrical &amp; DB</option>
              <option value="AC_TECHNICIAN">HVAC &amp; AC</option>
              <option value="PAINTER_SEEPAGE">Painter &amp; Seepage</option>
              <option value="CARPENTER_LOCKS">Carpenter &amp; Locks</option>
            </select>
          </div>

          {filteredTickets.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="No maintenance issues found"
              description="No work orders or repairs match your current filter."
              actionLabel="Reset Filter"
              onAction={() => { setStageFilter('ALL'); setTradeFilter('ALL'); setSearchQuery(''); }}
            />
          ) : (
            <div className="flex flex-col sm:flex-row" style={{ minHeight: '560px' }}>

              {/* LEFT: ticket list */}
              <div className="w-full sm:w-[340px] shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 overflow-y-auto" style={{ maxHeight: '720px' }}>
                {filteredTickets.map(ticket => {
                  const isSelected = selectedTicket?.id === ticket.id;
                  return (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={cn(
                        'w-full text-left px-4 py-3.5 border-b border-l-4 border-slate-100 cursor-pointer transition-colors block',
                        isSelected ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent hover:bg-slate-50'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('w-2 h-2 rounded-full shrink-0', URGENCY_DOT[ticket.urgency])} />
                        <span className="text-[12px] text-slate-500">{URGENCY_LABEL[ticket.urgency]}</span>
                      </div>
                      <div className="text-[14px] font-semibold truncate" style={{ color: isSelected ? '#2563EB' : HEADING }}>{ticket.title}</div>
                      <div className="text-[12px] text-slate-500 mt-0.5">{ticket.unitName} · {ticket.ticketNumber}</div>
                      <div className="mt-2">{getStatusBadge(ticket)}</div>
                    </button>
                  );
                })}
              </div>

              {/* RIGHT: detail panel */}
              <div className="flex-1 min-w-0 p-6 overflow-y-auto" style={{ maxHeight: '720px' }}>
                {selectedTicket && (
                  <div className="space-y-6">

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <Badge variant={getCategoryMeta(selectedTicket.category).variant}>{getCategoryMeta(selectedTicket.category).label}</Badge>
                          {getStatusBadge(selectedTicket)}
                          <span className="text-[12px] text-slate-400 font-mono">{selectedTicket.ticketNumber}</span>
                        </div>
                        <h2 className="text-lg font-bold" style={{ color: HEADING }}>{selectedTicket.title}</h2>
                        <p className="text-[13px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {selectedTicket.unitName} · {selectedTicket.propertyName}
                        </p>
                      </div>
                      <button
                        onClick={() => { if (confirm('Delete this ticket?')) deleteTicket(selectedTicket.id); }}
                        className="text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                        title="Delete ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Contextual CTA banner — one per status, unchanged logic */}
                    {(selectedTicket.status === 'REPORTED' || !selectedTicket.assignedMistri) && (
                      <div className="rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap" style={{ background: '#EEF1FA' }}>
                        <div className="flex items-center gap-2.5">
                          <Wrench className="w-4.5 h-4.5 text-blue-600" />
                          <span className="text-[13px] font-medium" style={{ color: HEADING }}>Awaiting an approved contractor to inspect and quote.</span>
                        </div>
                        <Button variant="default" className="font-semibold text-sm" onClick={() => setAssigningTicket(selectedTicket)}>
                          Assign Contractor
                        </Button>
                      </div>
                    )}

                    {selectedTicket.status === 'LANDLORD_APPROVAL_REQUIRED' && (
                      <div className="rounded-xl p-4 space-y-3 bg-amber-50">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4.5 h-4.5 text-amber-700" />
                          <span className="text-[13px] font-semibold text-amber-900">
                            Quote of Rs. {selectedTicket.totalCost?.toLocaleString()} exceeds the Rs. 5,000 auto-approval limit — landlord ({selectedTicket.owner.name}) authorization required.
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button variant="emerald" className="font-semibold text-sm" onClick={() => approveTicket(selectedTicket.id)}>
                            <Check className="w-4 h-4 mr-1.5" /> Approve Quote
                          </Button>
                          {selectedTicket.owner.whatsapp && onOpenWhatsAppWithMessage && (
                            <Button
                              variant="outline"
                              className="font-semibold text-sm bg-white"
                              onClick={() => onOpenWhatsAppWithMessage(
                                `Hello ${selectedTicket.owner.name}, repair estimate of Rs. ${selectedTicket.totalCost?.toLocaleString()} for ${selectedTicket.title} (${selectedTicket.unitName}) requires your approval. Reply APPROVE to proceed.`,
                                selectedTicket.owner.whatsapp
                              )}
                            >
                              <MessageSquare className="w-4 h-4 mr-1.5 text-emerald-600" /> Notify Landlord
                            </Button>
                          )}
                          <Button variant="ghost" className="font-semibold text-sm" onClick={() => setAssigningTicket(selectedTicket)}>
                            Revise Quote
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedTicket.status === 'IN_PROGRESS' && (
                      <div className="rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap bg-blue-50">
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-4.5 h-4.5 text-blue-600" />
                          <span className="text-[13px] font-medium text-blue-900">
                            {selectedTicket.assignedMistri?.name} is on-site executing the work order.
                          </span>
                        </div>
                        <Button variant="default" className="font-semibold text-sm" onClick={() => markJobFinishedByContractor(selectedTicket.id)}>
                          <CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark Job Finished
                        </Button>
                      </div>
                    )}

                    {selectedTicket.status === 'AWAITING_TENANT_VERIFICATION' && (
                      <div className="rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap bg-indigo-50">
                        <div className="flex items-center gap-2.5">
                          <Camera className="w-4.5 h-4.5 text-indigo-600" />
                          <span className="text-[13px] font-medium text-indigo-900">
                            {selectedTicket.tenantName} was prompted to inspect the repair and confirm satisfaction.
                          </span>
                        </div>
                        <Button
                          variant="purple"
                          className="font-semibold text-sm"
                          onClick={() => verifyWorkByTenant(selectedTicket.id, 5.0, ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400'], 'Verified: Work completed satisfactorily.')}
                        >
                          <Camera className="w-4 h-4 mr-1.5" /> Record Tenant Sign-Off
                        </Button>
                      </div>
                    )}

                    {selectedTicket.status === 'TENANT_VERIFIED' && (
                      <div className="rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap bg-teal-50">
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="w-4.5 h-4.5 text-teal-600" />
                          <span className="text-[13px] font-medium text-teal-900">Tenant verified (5.0★) — ready to release contractor invoice.</span>
                        </div>
                        <Button variant="emerald" className="font-semibold text-sm" onClick={() => closeTicketAndMakeInvoicePayable(selectedTicket.id)}>
                          <Check className="w-4 h-4 mr-1.5" /> Close &amp; Authorize Invoice
                        </Button>
                      </div>
                    )}

                    {selectedTicket.status === 'COMPLETED' && (
                      <div className="rounded-xl p-4 flex items-center gap-2.5 bg-emerald-50">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                        <span className="text-[13px] font-medium text-emerald-900">
                          Resolved — contractor invoice of Rs. {selectedTicket.totalCost?.toLocaleString()} marked PAYABLE.
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Fault report</div>
                      <p className="text-[14px] text-slate-700 leading-relaxed">{selectedTicket.description}</p>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Requester grid */}
                    <div>
                      <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2.5">Requester</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-[13px]">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          {selectedTicket.source === 'WHATSAPP_AUTO_INGEST' ? <MessageSquare className="w-3.5 h-3.5" /> : selectedTicket.source === 'PORTAL_REPORT' ? <Smartphone className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                          <span>{selectedTicket.source === 'WHATSAPP_AUTO_INGEST' ? 'via WhatsApp' : selectedTicket.source === 'PORTAL_REPORT' ? 'via Resident App' : 'Direct report'}</span>
                        </div>
                        <div><span className="text-slate-400 block">Reported by</span><span className="font-medium" style={{ color: HEADING }}>{selectedTicket.tenantName}</span></div>
                        <div><span className="text-slate-400 block">Phone</span><span className="font-medium" style={{ color: HEADING }}>{selectedTicket.tenantPhone}</span></div>
                        <div><span className="text-slate-400 block">Created</span><span className="font-medium" style={{ color: HEADING }}>{selectedTicket.createdAt}</span></div>
                        <div><span className="text-slate-400 block">Owner</span><span className="font-medium" style={{ color: HEADING }}>{selectedTicket.owner.name}</span></div>
                        <div><span className="text-slate-400 block">Owner type</span><span className="font-medium" style={{ color: HEADING }}>{selectedTicket.owner.role === 'OWNER_OVERSEAS' ? 'Overseas' : 'Local'}</span></div>
                      </div>
                    </div>

                    {/* Photos */}
                    {photos.length > 0 && (
                      <div>
                        <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2.5">Photos</div>
                        <div className="flex gap-3">
                          {photos.map(p => (
                            <div key={p.label} className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
                              <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                              <span className="absolute bottom-1 left-1.5 text-[10px] font-semibold text-white bg-black/50 rounded px-1.5 py-0.5">{p.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="h-px bg-slate-100" />

                    {/* Contractor & cost */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">Contractor &amp; cost</div>
                        <button onClick={() => setAssigningTicket(selectedTicket)} className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                          {selectedTicket.assignedMistri ? 'Edit / Reassign' : 'Assign Contractor'}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px] mb-3">
                        <div><span className="text-slate-400 block">Contractor</span><span className="font-medium" style={{ color: HEADING }}>{selectedTicket.assignedMistri?.name || 'Unassigned'}</span></div>
                        <div><span className="text-slate-400 block">Contact</span><span className="font-medium" style={{ color: HEADING }}>{selectedTicket.assignedMistri?.phone || '—'}</span></div>
                      </div>
                      <div className="rounded-xl p-3.5 space-y-1.5 text-[13px]" style={{ background: '#EEF1FA' }}>
                        <div className="flex justify-between text-slate-600"><span>Material</span><span className="font-semibold" style={{ color: HEADING }}>Rs. {selectedTicket.materialCost?.toLocaleString() || 0}</span></div>
                        <div className="flex justify-between text-slate-600"><span>Labour</span><span className="font-semibold" style={{ color: HEADING }}>Rs. {selectedTicket.labourCost?.toLocaleString() || 0}</span></div>
                        <div className="flex justify-between pt-1.5 border-t border-white text-[14px] font-bold" style={{ color: HEADING }}>
                          <span>Total</span>
                          <span>{selectedTicket.totalCost && selectedTicket.totalCost > 0 ? `Rs. ${selectedTicket.totalCost.toLocaleString()}` : 'Quote pending'}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* New Issue Intake Dialog */}
      {isNewJobModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in text-sm text-slate-900">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

            <div className="p-5 flex items-center justify-between" style={{ background: '#EEF1FA' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold" style={{ color: HEADING }}>Log New Maintenance Issue</h3>
                  <p className="text-sm text-slate-500">Intake issue before contractor assignment</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsNewJobModalOpen(false)} className="font-bold text-sm bg-white">
                Close
              </Button>
            </div>

            <form onSubmit={handleCreateNewJob} className="p-6 space-y-4 text-sm overflow-y-auto">

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-sm">Target Unit / Demise</label>
                <ComboBox
                  options={units.map(u => ({ value: u.id, label: u.unitNumber, sublabel: u.propertyName, group: u.propertyName }))}
                  value={newUnitId}
                  onChange={setNewUnitId}
                  placeholder="Select a unit…"
                  searchPlaceholder="Search by unit or property…"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-sm">Issue Summary / Fault Title</label>
                <Input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Water pump motor capacitor burnt / Split AC error"
                  required
                  className="text-sm bg-white font-medium"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-sm">Trade Category</label>
                  <TogglePills
                    options={[
                      { value: 'PLUMBER_PUMP_GEYSER', label: 'Plumbing' },
                      { value: 'ELECTRICIAN_UPS', label: 'Electrical' },
                      { value: 'AC_TECHNICIAN', label: 'HVAC / AC' },
                      { value: 'PAINTER_SEEPAGE', label: 'Painter' },
                      { value: 'CARPENTER_LOCKS', label: 'Carpenter' },
                      { value: 'GENERAL_HANDYMAN', label: 'General' },
                    ]}
                    value={newCategory}
                    onChange={val => setNewCategory(val as TradeCategory)}
                    columns={3}
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-sm">Priority</label>
                  <TogglePills
                    options={[
                      { value: 'LOW', label: 'Low' },
                      { value: 'STANDARD', label: 'Standard' },
                      { value: 'EMERGENCY', label: '🚨 Emergency' },
                    ]}
                    value={newUrgency}
                    onChange={val => setNewUrgency(val as TicketUrgency)}
                    columns={3}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl text-sm space-y-1" style={{ background: '#EEF1FA' }}>
                <span className="font-bold block" style={{ color: HEADING }}>Initial Status: Awaiting Inspection (Cost: Rs. 0)</span>
                <p className="text-slate-500 text-sm font-medium">
                  Contractor quotation is not required at intake. Once the issue is logged, dispatch a verified mistri to inspect the site and submit their itemized parts &amp; labour quote.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-sm">Fault Details &amp; Symptoms</label>
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Detail symptoms, affected room, tenant access instructions..."
                  className="text-sm bg-white font-medium"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full font-bold text-base h-12">
                  <Wrench className="w-4 h-4 mr-2" />
                  <span>Log Maintenance Issue (Pending Quote)</span>
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Assign Mistri & Dispatch Work Order Modal */}
      {assigningTicket && (
        <AssignContractorModal
          ticket={assigningTicket}
          isOpen={!!assigningTicket}
          onClose={() => setAssigningTicket(null)}
          onAssign={({ contractor, materialCost, labourCost }) => {
            assignContractorToTicket(assigningTicket.id, contractor, materialCost, labourCost);
            setAssigningTicket(null);
          }}
        />
      )}

    </div>
  );
};
