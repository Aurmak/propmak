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
  Eye, 
  MessageSquare, 
  ArrowRight,
  User,
  Building2,
  Calendar,
  Camera,
  Check,
  Smartphone,
  Phone,
  FileText,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { MaintenanceTicket, TradeCategory, TicketUrgency, TicketStatus } from '../../types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '../ui/sheet';
import { EmptyState } from '../ui/EmptyState';
import { AssignContractorModal } from './AssignContractorModal';
import { ComboBox } from '../ui/ComboBox';
import { TogglePills } from '../ui/TogglePills';

interface MaintenanceHubProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

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
    searchQuery, 
    setSearchQuery 
  } = usePropMAK();
  
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [tradeFilter, setTradeFilter] = useState<string>('ALL');
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [activeInspectorTicket, setActiveInspectorTicket] = useState<MaintenanceTicket | null>(null);
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
    if (stageFilter === 'EMERGENCY') return t.urgency === 'EMERGENCY';
    return true;
  });

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

  const getUrgencyBadge = (urgency: TicketUrgency) => {
    switch (urgency) {
      case 'EMERGENCY':
        return <Badge variant="destructive" className="animate-pulse">🚨 Emergency</Badge>;
      case 'STANDARD':
        return <Badge variant="secondary">Standard</Badge>;
      case 'LOW':
        return <Badge variant="outline">Low Priority</Badge>;
    }
  };

  const getStatusBadge = (ticket: MaintenanceTicket) => {
    if (ticket.status === 'LANDLORD_APPROVAL_REQUIRED') {
      return <Badge variant="amber">Awaiting Landlord Approval</Badge>;
    }
    if (ticket.status === 'IN_PROGRESS') {
      return <Badge variant="blue">In Progress</Badge>;
    }
    if (ticket.status === 'AWAITING_TENANT_VERIFICATION') {
      return <Badge variant="purple">Awaiting Tenant</Badge>;
    }
    if (ticket.status === 'TENANT_VERIFIED') {
      return <Badge variant="teal">Tenant Verified ★</Badge>;
    }
    if (ticket.status === 'REPORTED' || !ticket.assignedMistri) {
      return <Badge variant="secondary">New Issue • Awaiting Mistri</Badge>;
    }
    if (ticket.status === 'COMPLETED') {
      return (
        <Badge variant="emerald">
          {ticket.contractorInvoiceStatus === 'PAYABLE' ? 'Closed • Payable' : 'Resolved'}
        </Badge>
      );
    }
    return <Badge variant="secondary">{ticket.status}</Badge>;
  };

  const handleCreateNewJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUnitId) return;

    createTicket({
      unitId: newUnitId,
      title: newTitle,
      description: newDescription,
      category: newCategory,
      urgency: newUrgency,
      materialCost: 0,
      labourCost: 0
    });

    setIsNewJobModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const reportedUnassignedCount = tickets.filter(t => t.status === 'REPORTED' || !t.assignedMistri).length;
  const pendingApprovalsCount = tickets.filter(t => t.status === 'LANDLORD_APPROVAL_REQUIRED').length;
  const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const verificationCount = tickets.filter(t => t.status === 'AWAITING_TENANT_VERIFICATION' || t.status === 'TENANT_VERIFIED').length;

  return (
    <div className="space-y-6 text-slate-900 text-sm">
      
      {/* Top Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Issues & Maintenance Pipeline
              </h1>
              <Badge variant="secondary" className="font-bold text-sm">
                {tickets.length} Active Issues
              </Badge>
            </div>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Issue intake, contractor assignment, inspection quotes, and landlord authorizations
            </p>
          </div>

          <Button
            variant="default"
            onClick={() => setIsNewJobModalOpen(true)}
            className="font-bold text-sm"
          >
            <Plus className="w-4 h-4 text-amber-400 mr-1.5" />
            <span>Report New Issue</span>
          </Button>
        </div>
      </Card>

      {/* Filter Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Stage Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm">
            {[
              { id: 'ALL', label: `All Issues (${tickets.length})` },
              { id: 'REPORTED', label: `Awaiting Mistri (${reportedUnassignedCount})` },
              { id: 'APPROVAL', label: `Awaiting Landlord (${pendingApprovalsCount})` },
              { id: 'IN_PROGRESS', label: `In Progress (${inProgressCount})` },
              { id: 'VERIFICATION', label: `Tenant Verification (${verificationCount})` },
              { id: 'COMPLETED', label: 'Completed' }
            ].map(tab => (
              <Button
                key={tab.id}
                size="sm"
                variant={stageFilter === tab.id ? 'default' : 'ghost'}
                onClick={() => setStageFilter(tab.id)}
                className="h-9 px-3.5 text-sm font-bold whitespace-nowrap cursor-pointer"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Trade Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700 font-bold uppercase whitespace-nowrap">Trade:</span>
            <select
              value={tradeFilter}
              onChange={(e) => setTradeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-slate-800 cursor-pointer"
            >
              <option value="ALL">All Trades</option>
              <option value="PLUMBER_PUMP_GEYSER">Plumbing & Water Motors</option>
              <option value="ELECTRICIAN_UPS">Electrical & DB</option>
              <option value="AC_TECHNICIAN">HVAC & AC</option>
              <option value="PAINTER_SEEPAGE">Painter & Seepage</option>
              <option value="CARPENTER_LOCKS">Carpenter & Locks</option>
            </select>
          </div>

        </div>
      </Card>

      {/* Simplified Clean Issues Data Table */}
      {filteredTickets.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No maintenance issues found"
          description="No work orders or repairs match your current filter."
          actionLabel="Reset Filter"
          onAction={() => {
            setStageFilter('ALL');
            setTradeFilter('ALL');
            setSearchQuery('');
          }}
        />
      ) : (
        <Card className="overflow-hidden shadow-sm">
          <Table aria-label="Maintenance Issues Table">
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-sm">Issue & Trade</TableHead>
                <TableHead className="font-bold text-sm">Property & Resident</TableHead>
                <TableHead className="font-bold text-sm">Priority</TableHead>
                <TableHead className="font-bold text-sm">Status</TableHead>
                <TableHead className="font-bold text-sm">Quote & Contractor</TableHead>
                <TableHead className="text-right font-bold text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => {
                const categoryMeta = getCategoryMeta(ticket.category);
                const CatIcon = categoryMeta.icon;

                return (
                  <TableRow 
                    key={ticket.id}
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setActiveInspectorTicket(ticket)}
                  >
                    {/* Column 1: Issue & Trade */}
                    <TableCell className="max-w-xs">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="font-mono font-bold text-slate-500 text-sm">{ticket.ticketNumber}</span>
                        
                        {ticket.source === 'WHATSAPP_AUTO_INGEST' ? (
                          <span title="Inbound via WhatsApp" className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 shrink-0">
                            <MessageSquare className="w-3 h-3" aria-label="WhatsApp Inbound" />
                          </span>
                        ) : ticket.source === 'PORTAL_REPORT' ? (
                          <span title="Reported via Resident App" className="inline-flex items-center justify-center w-5 h-5 rounded bg-blue-100 border border-blue-300 text-blue-800 shrink-0">
                            <Smartphone className="w-3 h-3" aria-label="Resident App" />
                          </span>
                        ) : (
                          <span title="Agency Direct Report" className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-100 border border-slate-300 text-slate-700 shrink-0">
                            <User className="w-3 h-3" aria-label="Direct Report" />
                          </span>
                        )}

                        <Badge variant={categoryMeta.variant}>
                          <CatIcon className="w-3.5 h-3.5 mr-1" />
                          <span>{categoryMeta.label}</span>
                        </Badge>
                      </div>
                      <span className="font-bold text-slate-900 text-sm block truncate">{ticket.title}</span>
                    </TableCell>

                    {/* Column 2: Property & Resident */}
                    <TableCell>
                      <span className="font-bold text-slate-900 block text-sm">{ticket.unitName}</span>
                      <span className="text-sm text-slate-600 font-medium block">{ticket.propertyName}</span>
                      <span className="text-sm text-slate-500 font-semibold mt-0.5 block">{ticket.tenantName}</span>
                    </TableCell>

                    {/* Column 3: Priority */}
                    <TableCell>
                      {getUrgencyBadge(ticket.urgency)}
                    </TableCell>

                    {/* Column 4: Status */}
                    <TableCell>
                      {getStatusBadge(ticket)}
                    </TableCell>

                    {/* Column 5: Quote & Contractor */}
                    <TableCell>
                      {ticket.totalCost && ticket.totalCost > 0 ? (
                        <div>
                          <span className="font-black text-slate-950 text-sm block">Rs. {ticket.totalCost.toLocaleString()}</span>
                          <span className="text-sm text-slate-600 font-medium">{ticket.assignedMistri?.name || 'Unassigned'}</span>
                        </div>
                      ) : (
                        <div>
                          <Badge variant="outline">Quote Pending</Badge>
                          <span className="text-sm text-slate-500 italic block mt-0.5">Awaiting inspection</span>
                        </div>
                      )}
                    </TableCell>

                    {/* Column 6: Action */}
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-bold text-sm h-8 px-3"
                        onClick={() => setActiveInspectorTicket(ticket)}
                      >
                        <span>Review Issue</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 text-amber-500" />
                      </Button>
                    </TableCell>

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Right-Hand Slide-Over Issue Inspector (`Sheet`) with Rich Contextual CTAs */}
      <Sheet open={!!activeInspectorTicket} onOpenChange={(open) => { if (!open) setActiveInspectorTicket(null); }}>
        {activeInspectorTicket && (
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            
            <SheetHeader className="pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <Badge variant={getCategoryMeta(activeInspectorTicket.category).variant}>
                  {getCategoryMeta(activeInspectorTicket.category).label}
                </Badge>
                <span className="text-sm font-mono font-bold text-slate-500">{activeInspectorTicket.ticketNumber}</span>
              </div>
              <SheetTitle className="text-xl font-black text-slate-900">{activeInspectorTicket.title}</SheetTitle>
              <SheetDescription className="flex items-center gap-1.5 text-slate-700 font-medium text-sm mt-1">
                <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{activeInspectorTicket.unitName} • {activeInspectorTicket.propertyName}</span>
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 my-5 text-sm text-slate-800">
              
              {/* PRIMARY CONTEXTUAL CTA BANNER - Top Focus */}
              {/* 1. Unassigned / Quote Pending State */}
              {(activeInspectorTicket.status === 'REPORTED' || !activeInspectorTicket.assignedMistri) && (
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 shadow-lg border border-slate-800 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-base text-white">Action Required: Assign Contractor</span>
                    </div>
                    <Badge variant="amber">Pending Mistri</Badge>
                  </div>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    This issue was logged by the resident and is awaiting an approved trade contractor to inspect the site and submit their material and labour quote.
                  </p>
                  <Button
                    variant="default"
                    className="w-full font-black text-base h-12 bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md"
                    onClick={() => {
                      setAssigningTicket(activeInspectorTicket);
                    }}
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    <span>Assign Contractor & Schedule Inspection Quote</span>
                  </Button>
                </div>
              )}

              {/* 2. Landlord Approval Required State (> Rs. 5,000 Threshold) */}
              {activeInspectorTicket.status === 'LANDLORD_APPROVAL_REQUIRED' && (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 space-y-4 shadow-sm animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span className="font-bold text-base text-amber-950">Landlord Approval Required</span>
                    </div>
                    <Badge variant="amber">Threshold Exceeded</Badge>
                  </div>
                  <p className="text-sm text-amber-900 leading-relaxed font-medium">
                    The quote of <strong>Rs. {activeInspectorTicket.totalCost?.toLocaleString()}</strong> exceeds the agency auto-approval limit of Rs. 5,000. Landlord ({activeInspectorTicket.owner.name}) authorization is required before work can commence.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                    <Button
                      variant="emerald"
                      className="w-full sm:flex-1 font-bold text-sm h-10"
                      onClick={() => {
                        approveTicket(activeInspectorTicket.id);
                        setActiveInspectorTicket(null);
                      }}
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      <span>Approve Quote (Rs. {activeInspectorTicket.totalCost?.toLocaleString()})</span>
                    </Button>

                    {activeInspectorTicket.owner.whatsapp && onOpenWhatsAppWithMessage && (
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto font-bold text-sm h-10 bg-white border-amber-300 text-amber-950 hover:bg-amber-100"
                        onClick={() => {
                          onOpenWhatsAppWithMessage(
                            `Hello ${activeInspectorTicket.owner.name}, repair estimate of Rs. ${activeInspectorTicket.totalCost?.toLocaleString()} for ${activeInspectorTicket.title} (${activeInspectorTicket.unitName}) requires your approval. Reply APPROVE to proceed.`,
                            activeInspectorTicket.owner.whatsapp
                          );
                        }}
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-600 mr-1.5" />
                        <span>Notify Landlord</span>
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      className="w-full sm:w-auto text-slate-700 font-bold text-sm h-10 hover:bg-amber-100"
                      onClick={() => setAssigningTicket(activeInspectorTicket)}
                    >
                      <span>Revise Quote</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* 3. In Progress State (Contractor Executing Repair) */}
              {activeInspectorTicket.status === 'IN_PROGRESS' && (
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3 shadow-sm animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-base text-blue-950">Work in Progress</span>
                    </div>
                    <Badge variant="blue">On-Site</Badge>
                  </div>
                  <p className="text-sm text-blue-900 leading-relaxed font-medium">
                    Contractor <strong>{activeInspectorTicket.assignedMistri?.name}</strong> is currently on-site executing the work order. When work is finished, trigger the tenant completion sign-off.
                  </p>
                  <Button
                    variant="default"
                    className="w-full font-bold text-base h-12 bg-slate-900 text-white hover:bg-slate-800"
                    onClick={() => {
                      markJobFinishedByContractor(activeInspectorTicket.id);
                      setActiveInspectorTicket(null);
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2" />
                    <span>Mark Job Finished (Send Sign-Off Prompt)</span>
                  </Button>
                </div>
              )}

              {/* 4. Awaiting Tenant Verification State */}
              {activeInspectorTicket.status === 'AWAITING_TENANT_VERIFICATION' && (
                <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-3 shadow-sm animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-purple-600" />
                      <span className="font-bold text-base text-purple-950">Awaiting Resident Confirmation</span>
                    </div>
                    <Badge variant="purple">Verification Pending</Badge>
                  </div>
                  <p className="text-sm text-purple-900 leading-relaxed font-medium">
                    Resident <strong>{activeInspectorTicket.tenantName}</strong> received a digital prompt to inspect the repair and confirm satisfaction.
                  </p>
                  <Button
                    variant="purple"
                    className="w-full font-bold text-base h-12"
                    onClick={() => {
                      verifyWorkByTenant(
                        activeInspectorTicket.id, 
                        5.0, 
                        ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400'],
                        'Verified: Work completed satisfactorily.'
                      );
                      setActiveInspectorTicket(null);
                    }}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    <span>Record Tenant Sign-Off & Photos</span>
                  </Button>
                </div>
              )}

              {/* 5. Tenant Verified State -> Ready for Final Agent Closure */}
              {activeInspectorTicket.status === 'TENANT_VERIFIED' && (
                <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-3 shadow-sm animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-teal-600" />
                      <span className="font-bold text-base text-teal-950">Tenant Verified (5.0 ★ Satisfied)</span>
                    </div>
                    <Badge variant="teal">Ready for Payment</Badge>
                  </div>
                  <p className="text-sm text-teal-900 leading-relaxed font-medium">
                    Resident confirmed the repair is 100% operational. Authorize ticket closure to release contractor invoice to <strong>PAYABLE</strong>.
                  </p>
                  <Button
                    variant="emerald"
                    className="w-full font-bold text-base h-12 shadow-sm"
                    onClick={() => {
                      closeTicketAndMakeInvoicePayable(activeInspectorTicket.id);
                      setActiveInspectorTicket(null);
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    <span>Close Issue & Authorize Contractor Invoice (Rs. {activeInspectorTicket.totalCost?.toLocaleString()} Payable)</span>
                  </Button>
                </div>
              )}

              {/* 6. Completed State */}
              {activeInspectorTicket.status === 'COMPLETED' && (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-base text-emerald-950">Issue Resolved & Closed</span>
                    </div>
                    <Badge variant="emerald">Payable Released</Badge>
                  </div>
                  <p className="text-sm text-emerald-900 font-medium">
                    Contractor invoice of <strong>Rs. {activeInspectorTicket.totalCost?.toLocaleString()}</strong> is marked as PAYABLE in financial ledgers.
                  </p>
                </div>
              )}

              {/* Fault Description & Reported Symptoms */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Resident's Fault Report</span>
                <p className="text-slate-900 leading-relaxed font-medium text-sm">{activeInspectorTicket.description}</p>
                
                <div className="pt-3 flex items-center justify-between text-sm border-t border-slate-200 text-slate-600">
                  <span>Reported by: <strong className="text-slate-900">{activeInspectorTicket.tenantName}</strong> ({activeInspectorTicket.tenantPhone})</span>
                  <span>{activeInspectorTicket.createdAt}</span>
                </div>
              </div>

              {/* Photo Preview if any */}
              {activeInspectorTicket.beforePhotoUrl && (
                <div className="space-y-2">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Uploaded Issue Photo</span>
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-1.5">
                    <img 
                      src={activeInspectorTicket.beforePhotoUrl} 
                      alt="Fault photo" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Contractor & Cost Quotation Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-900 text-sm">Contractor & Cost Breakdown</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-bold text-sm h-7 px-2.5"
                    onClick={() => setAssigningTicket(activeInspectorTicket)}
                  >
                    {activeInspectorTicket.assignedMistri ? 'Edit Quote / Reassign' : 'Assign Contractor'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-600 font-medium block">Assigned Contractor:</span>
                    <strong className="text-slate-950 block">{activeInspectorTicket.assignedMistri?.name || 'Unassigned'}</strong>
                    <span className="text-slate-600 text-sm">{activeInspectorTicket.assignedMistri?.trade || 'No trade assigned'}</span>
                  </div>

                  <div>
                    <span className="text-slate-600 font-medium block">Contact Number:</span>
                    <strong className="text-slate-950 block">{activeInspectorTicket.assignedMistri?.phone || 'N/A'}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Material / Replacement Parts:</span>
                    <span className="font-bold text-slate-900">Rs. {activeInspectorTicket.materialCost?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Technician Labour & Service:</span>
                    <span className="font-bold text-slate-900">Rs. {activeInspectorTicket.labourCost?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                    <span>Total Repair Quote:</span>
                    <span className="text-base text-slate-950 font-black">
                      {activeInspectorTicket.totalCost && activeInspectorTicket.totalCost > 0 ? `Rs. ${activeInspectorTicket.totalCost.toLocaleString()}` : 'Quote Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stakeholder Owner Information */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-sm">
                <div>
                  <span className="text-slate-600 font-medium block">Property Owner / Landlord</span>
                  <p className="font-bold text-slate-900 text-sm">{activeInspectorTicket.owner.name}</p>
                  <p className="text-slate-600 text-sm">{activeInspectorTicket.owner.location}</p>
                </div>
                <Badge variant="outline" className="bg-white font-bold text-sm">
                  {activeInspectorTicket.owner.role === 'OWNER_OVERSEAS' ? 'Overseas Landlord' : 'Local Owner'}
                </Badge>
              </div>

            </div>

          </SheetContent>
        )}
      </Sheet>

      {/* New Issue Intake Dialog */}
      {isNewJobModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in text-sm text-slate-900">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <Wrench className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Log New Maintenance Issue</h3>
                  <p className="text-sm text-slate-600">Intake issue before contractor assignment</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsNewJobModalOpen(false)}
                className="font-bold text-sm"
              >
                Close
              </Button>
            </div>

            <form onSubmit={handleCreateNewJob} className="p-6 space-y-4 text-sm overflow-y-auto">
              
              {/* Unit Selection */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-sm">Target Unit / Demise</label>
                <ComboBox
                  options={units.map(u => ({
                    value: u.id,
                    label: u.unitNumber,
                    sublabel: u.propertyName,
                    group: u.propertyName
                  }))}
                  value={newUnitId}
                  onChange={setNewUnitId}
                  placeholder="Select a unit…"
                  searchPlaceholder="Search by unit or property…"
                />
              </div>

              {/* Title */}
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

                   {/* Category & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              {/* Cost Notice */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-1">
                <span className="font-bold text-slate-900 block">Initial Status: Awaiting Inspection (Cost: Rs. 0)</span>
                <p className="text-slate-600 text-sm font-medium">
                  Contractor quotation is not required at intake. Once the issue is logged, dispatch a verified mistri to inspect the site and submit their itemized parts & labour quote.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-sm">Fault Details & Symptoms</label>
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Detail symptoms, affected room, tenant access instructions..."
                  className="text-sm bg-white font-medium"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full font-bold text-base h-12"
                >
                  <Wrench className="w-4 h-4 text-amber-400 mr-2" />
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
            assignContractorToTicket(
              assigningTicket.id,
              contractor,
              materialCost,
              labourCost
            );
            setAssigningTicket(null);
            setActiveInspectorTicket(null);
          }}
        />
      )}

    </div>
  );
};
