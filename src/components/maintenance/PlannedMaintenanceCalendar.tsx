'use client';

import React, { useState, useMemo } from 'react';
import {
  CalendarClock,
  Fuel,
  Bug,
  Droplets,
  Paintbrush,
  ArrowUpDown,
  FlameKindling,
  MoreHorizontal,
  Plus,
  X,
  Check,
  Trash2,
  ArrowRight,
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { PlannedMaintenanceJob, PlannedJobType, PlannedJobFrequency } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EmptyState } from '../ui/EmptyState';
import { ComboBox } from '../ui/ComboBox';
import { TogglePills } from '../ui/TogglePills';

const JOB_META: Record<PlannedJobType, { label: string; icon: typeof CalendarClock }> = {
  GENERATOR_SERVICE: { label: 'Generator Service', icon: Fuel },
  PEST_CONTROL: { label: 'Pest Control', icon: Bug },
  WATER_TANK_CLEANING: { label: 'Water Tank Cleaning', icon: Droplets },
  PAINTING: { label: 'Painting', icon: Paintbrush },
  LIFT_AMC: { label: 'Lift AMC', icon: ArrowUpDown },
  FIRE_SAFETY_CHECK: { label: 'Fire Safety Check', icon: FlameKindling },
  OTHER: { label: 'Other', icon: MoreHorizontal }
};

const FREQUENCY_LABEL: Record<PlannedJobFrequency, string> = {
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  HALF_YEARLY: 'Half-Yearly',
  YEARLY: 'Yearly',
  ONE_TIME: 'One-Time'
};

type ComputedStatus = 'OVERDUE' | 'DUE_SOON' | 'UPCOMING';

function computeStatus(dueDate: string): ComputedStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'OVERDUE';
  if (diffDays <= 14) return 'DUE_SOON';
  return 'UPCOMING';
}

const STATUS_META: Record<ComputedStatus, { label: string; variant: 'destructive' | 'amber' | 'blue'; icon: typeof AlertTriangle }> = {
  OVERDUE: { label: 'Overdue', variant: 'destructive', icon: AlertTriangle },
  DUE_SOON: { label: 'Due Soon', variant: 'amber', icon: Clock },
  UPCOMING: { label: 'Upcoming', variant: 'blue', icon: CalendarClock }
};

// ─── Add Planned Job Modal ───────────────────────────────────────────────────

const AddJobModal: React.FC<{ isOpen: boolean; onClose: () => void; properties: string[] }> = ({ isOpen, onClose, properties }) => {
  const { addPlannedJob } = usePropMAK();

  const [propertyName, setPropertyName] = useState(properties[0] || '');
  const [jobType, setJobType] = useState<PlannedJobType>('GENERATOR_SERVICE');
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<PlannedJobFrequency>('QUARTERLY');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignedContractorName, setAssignedContractorName] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyName || !title) return;
    addPlannedJob({
      propertyName,
      jobType,
      title,
      frequency,
      dueDate,
      assignedContractorName: assignedContractorName || undefined,
      estimatedCost: estimatedCost || undefined
    });
    onClose();
    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in text-slate-800">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 flex items-center justify-between" style={{ background: '#EEF1FA' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight" style={{ color: '#1B2559' }}>Schedule Planned Maintenance</h3>
              <p className="text-[13px] text-slate-500">Recurring preventive job, not a reactive repair</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Building / Property *</label>
            <ComboBox
              options={properties.map(p => ({ value: p, label: p }))}
              value={propertyName}
              onChange={setPropertyName}
              placeholder="Select a building…"
              searchPlaceholder="Search property…"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Job Type *</label>
            <TogglePills
              options={[
                { value: 'GENERATOR_SERVICE', label: 'Generator Service' },
                { value: 'PEST_CONTROL', label: 'Pest Control' },
                { value: 'WATER_TANK_CLEANING', label: 'Water Tank Cleaning' },
                { value: 'PAINTING', label: 'Painting' },
                { value: 'LIFT_AMC', label: 'Lift AMC' },
                { value: 'FIRE_SAFETY_CHECK', label: 'Fire Safety Check' },
                { value: 'OTHER', label: 'Other' }
              ]}
              value={jobType}
              onChange={val => setJobType(val as PlannedJobType)}
              columns={2}
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Job Title *</label>
            <Input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Generator Service & Oil Change"
              className="bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Frequency</label>
              <TogglePills
                options={[
                  { value: 'MONTHLY', label: 'Monthly' },
                  { value: 'QUARTERLY', label: 'Quarterly' },
                  { value: 'HALF_YEARLY', label: 'Half-Yearly' },
                  { value: 'YEARLY', label: 'Yearly' },
                  { value: 'ONE_TIME', label: 'One-Time' }
                ]}
                value={frequency}
                onChange={val => setFrequency(val as PlannedJobFrequency)}
                columns={2}
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Due Date *</label>
                <Input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-white" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Est. Cost (Rs.)</label>
                <Input type="number" value={estimatedCost || ''} onChange={(e) => setEstimatedCost(Number(e.target.value))} placeholder="0" className="bg-white" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Assigned Contractor</label>
            <Input
              type="text"
              value={assignedContractorName}
              onChange={(e) => setAssignedContractorName(e.target.value)}
              placeholder="e.g. Malik Generators & Diesel Works"
              className="bg-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="default">
              <Check className="w-4 h-4 text-white/90 mr-1" />
              <span>Schedule Job</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const PlannedMaintenanceCalendar: React.FC = () => {
  const { plannedJobs, units, completePlannedJob, deletePlannedJob } = usePropMAK();

  const [propertyFilter, setPropertyFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ComputedStatus>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const properties = useMemo(() => Array.from(new Set(units.map(u => u.propertyName))).sort(), [units]);

  const jobsWithStatus = useMemo(() =>
    plannedJobs
      .map(j => ({ job: j, status: computeStatus(j.dueDate) }))
      .sort((a, b) => new Date(a.job.dueDate).getTime() - new Date(b.job.dueDate).getTime()),
    [plannedJobs]
  );

  const filtered = jobsWithStatus.filter(({ job, status }) => {
    if (propertyFilter !== 'ALL' && job.propertyName !== propertyFilter) return false;
    if (statusFilter !== 'ALL' && status !== statusFilter) return false;
    return true;
  });

  const selectedJob = filtered.find(({ job }) => job.id === selectedJobId)?.job || filtered[0]?.job || null;

  const stats = useMemo(() => {
    const overdue = jobsWithStatus.filter(j => j.status === 'OVERDUE').length;
    const dueSoon = jobsWithStatus.filter(j => j.status === 'DUE_SOON').length;
    const upcoming = jobsWithStatus.filter(j => j.status === 'UPCOMING').length;
    return { overdue, dueSoon, upcoming };
  }, [jobsWithStatus]);

  return (
    <div className="space-y-6 text-slate-900 text-sm animate-in fade-in">

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Planned Maintenance Calendar</h1>
              <Badge variant="secondary">{plannedJobs.length} Jobs</Badge>
              {stats.overdue > 0 && <Badge variant="destructive" className="animate-pulse">{stats.overdue} Overdue</Badge>}
            </div>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Recurring preventive jobs — generator servicing, pest control, tank cleaning, lift AMC — scheduled ahead instead of reported as breakdowns
            </p>
          </div>
          <Button variant="default" onClick={() => setIsAddModalOpen(true)} className="font-bold text-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Schedule Job</span>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card
          className={`p-4 flex items-center gap-3 cursor-pointer transition-all ${statusFilter === 'OVERDUE' ? 'ring-2 ring-rose-400' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'OVERDUE' ? 'ALL' : 'OVERDUE')}
        >
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0"><AlertTriangle className="w-4 h-4" /></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Overdue</div>
            <div className="text-lg font-black text-slate-900">{stats.overdue}</div>
          </div>
        </Card>
        <Card
          className={`p-4 flex items-center gap-3 cursor-pointer transition-all ${statusFilter === 'DUE_SOON' ? 'ring-2 ring-amber-400' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'DUE_SOON' ? 'ALL' : 'DUE_SOON')}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0"><Clock className="w-4 h-4" /></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Due Soon (14d)</div>
            <div className="text-lg font-black text-slate-900">{stats.dueSoon}</div>
          </div>
        </Card>
        <Card
          className={`p-4 flex items-center gap-3 cursor-pointer transition-all ${statusFilter === 'UPCOMING' ? 'ring-2 ring-blue-400' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'UPCOMING' ? 'ALL' : 'UPCOMING')}
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0"><CalendarClock className="w-4 h-4" /></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Upcoming</div>
            <div className="text-lg font-black text-slate-900">{stats.upcoming}</div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 font-bold focus:outline-none focus:border-slate-800 cursor-pointer"
          >
            <option value="ALL">All Buildings</option>
            {properties.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {statusFilter !== 'ALL' && (
            <Button size="sm" variant="ghost" onClick={() => setStatusFilter('ALL')} className="font-bold text-sm">
              Clear status filter
            </Button>
          )}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No planned maintenance jobs found"
          description="No recurring maintenance jobs match your active filter."
          actionLabel="Reset Filters"
          onAction={() => { setPropertyFilter('ALL'); setStatusFilter('ALL'); }}
        />
      ) : (
        <Card className="overflow-hidden shadow-sm">
          <div className="flex flex-col sm:flex-row" style={{ minHeight: '560px' }}>

            {/* LEFT: job list */}
            <div className="w-full sm:w-[340px] shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {filtered.map(({ job, status }) => {
                const meta = JOB_META[job.jobType];
                const Icon = meta.icon;
                const statusMeta = STATUS_META[status];
                const StatusIcon = statusMeta.icon;
                const isSelected = selectedJob?.id === job.id;
                return (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`w-full text-left px-4 py-3.5 border-b border-l-4 border-slate-100 cursor-pointer transition-colors block ${
                      isSelected ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[12px] text-slate-500 truncate">{meta.label}</span>
                    </div>
                    <div className={`text-[14px] font-semibold truncate ${isSelected ? 'text-blue-600' : 'text-slate-900'}`}>{job.title}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5 truncate">{job.propertyName} · Due {job.dueDate}</div>
                    <div className="mt-2">
                      <Badge variant={statusMeta.variant}><StatusIcon className="w-3 h-3" /><span>{statusMeta.label}</span></Badge>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: detail panel */}
            <div className="flex-1 min-w-0 p-6 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {selectedJob && (() => {
                const status = computeStatus(selectedJob.dueDate);
                const statusMeta = STATUS_META[status];
                const meta = JOB_META[selectedJob.jobType];
                return (
                  <div className="space-y-6 text-sm text-slate-800">

                    {/* Header */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <Badge variant="secondary">{meta.label}</Badge>
                        <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                      </div>
                      <h2 className="text-lg font-black text-slate-900">{selectedJob.title}</h2>
                      <p className="flex items-center gap-1.5 text-slate-700 font-medium text-sm mt-1">
                        <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{selectedJob.propertyName}</span>
                      </p>
                    </div>

                    <div className={`p-5 rounded-2xl space-y-3 shadow-sm border ${
                      status === 'OVERDUE' ? 'bg-rose-50 border-rose-200' : status === 'DUE_SOON' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-base text-slate-900">Due: {selectedJob.dueDate}</span>
                        <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                      </div>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">
                        Recurs <strong>{FREQUENCY_LABEL[selectedJob.frequency]}</strong>{selectedJob.lastCompletedDate ? ` · last completed ${selectedJob.lastCompletedDate}` : ' · not yet completed'}.
                      </p>
                      <Button
                        variant="emerald"
                        className="w-full font-bold text-base h-12"
                        onClick={() => completePlannedJob(selectedJob.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        <span>Mark Completed{selectedJob.frequency !== 'ONE_TIME' ? ' & Schedule Next' : ''}</span>
                      </Button>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div>
                      <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Job Details</div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 font-medium">Assigned Contractor:</span>
                          <span className="font-bold text-slate-900">{selectedJob.assignedContractorName || 'Unassigned'}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                          <span className="text-slate-600 font-medium">Estimated Cost:</span>
                          <span className="font-bold text-slate-900">{selectedJob.estimatedCost ? `Rs. ${selectedJob.estimatedCost.toLocaleString()}` : '—'}</span>
                        </div>
                        {selectedJob.notes && (
                          <p className="text-sm text-slate-600 font-medium pt-2 border-t border-slate-200">{selectedJob.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-sm"
                        onClick={() => {
                          if (confirm('Delete this planned maintenance job?')) {
                            deletePlannedJob(selectedJob.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        <span>Delete Job</span>
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </Card>
      )}

      {isAddModalOpen && (
        <AddJobModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} properties={properties} />
      )}
    </div>
  );
};
