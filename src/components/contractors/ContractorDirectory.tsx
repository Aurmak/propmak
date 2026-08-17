'use client';

import React, { useState } from 'react';
import {
  Users,
  Wrench,
  Droplets,
  Zap,
  Wind,
  Paintbrush,
  Key,
  Star,
  Plus,
  Search,
  Edit2,
  Trash2,
  Briefcase
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EmptyState } from '../ui/EmptyState';
import { usePropMAK } from '../../context/PropMAKContext';
import { AddContractorModal } from './AddContractorModal';
import { EditContractorModal } from './EditContractorModal';
import { Contractor, TradeCategory } from '../../types';
import { cn } from '@/lib/utils';

const HEADING = '#1B2559';

export const ContractorDirectory: React.FC = () => {
  const { contractors, addContractor, updateContractor, deleteContractor, searchQuery, setSearchQuery } = usePropMAK();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const [selectedContractorId, setSelectedContractorId] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<string>('ALL');

  const filteredContractors = contractors.filter(c => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = c.name.toLowerCase().includes(q) ||
        c.trade.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.cnicNumber && c.cnicNumber.includes(q));
      if (!match) return false;
    }

    if (selectedTrade === 'ALL') return true;
    return c.category === selectedTrade;
  });

  const selectedContractor = filteredContractors.find(c => c.id === selectedContractorId) || filteredContractors[0] || null;

  const getTradeMeta = (category: TradeCategory) => {
    switch (category) {
      case 'PLUMBER_PUMP_GEYSER':
        return { label: 'Plumbing & Pumps', icon: Droplets, variant: 'blue' as const };
      case 'ELECTRICIAN_UPS':
        return { label: 'Electrical & DB', icon: Zap, variant: 'amber' as const };
      case 'AC_TECHNICIAN':
        return { label: 'HVAC & AC Specialist', icon: Wind, variant: 'teal' as const };
      case 'PAINTER_SEEPAGE':
        return { label: 'Painter & Seepage', icon: Paintbrush, variant: 'purple' as const };
      case 'CARPENTER_LOCKS':
        return { label: 'Carpenter & Locks', icon: Key, variant: 'emerald' as const };
      default:
        return { label: 'General Maintenance', icon: Wrench, variant: 'secondary' as const };
    }
  };

  return (
    <div className="space-y-6 text-slate-900 text-sm animate-in fade-in">
      
      {/* Header Banner */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold" style={{ color: HEADING }}>
                Verified Contractors & Trade Directory
              </h1>
              <Badge variant="secondary">
                {contractors.length} Verified Trades
              </Badge>
            </div>
            <p className="text-[13px] text-slate-500 mt-1">
              Vetted trade specialists: Electricians, Plumbers, HVAC mechanics, and Carpenters
            </p>
          </div>

          <Button
            variant="default"
            onClick={() => setIsAddModalOpen(true)}
            className="font-bold text-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Onboard Contractor</span>
          </Button>
        </div>
      </Card>

      {/* Filter Toolbar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

          {/* Trade Filter Tabs */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {[
              { id: 'ALL', label: `All Trades (${contractors.length})` },
              { id: 'PLUMBER_PUMP_GEYSER', label: 'Plumbing & Pumps', icon: Droplets },
              { id: 'ELECTRICIAN_UPS', label: 'Electrical & DB', icon: Zap },
              { id: 'AC_TECHNICIAN', label: 'HVAC & AC', icon: Wind },
              { id: 'PAINTER_SEEPAGE', label: 'Painting', icon: Paintbrush },
              { id: 'CARPENTER_LOCKS', label: 'Carpentry', icon: Key }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTrade(tab.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-[13px] whitespace-nowrap transition-colors flex items-center cursor-pointer',
                  selectedTrade === tab.id ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700'
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
              placeholder="Search contractor name, phone, trade..."
              className="pl-9 h-9 text-sm bg-white font-medium"
            />
          </div>

        </div>
      </Card>

      {/* Master-Detail: Contractor List + Profile Inspector */}
      {filteredContractors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contractors found"
          description="No trade specialists match your current filter."
          actionLabel="Reset Trade Filter"
          onAction={() => {
            setSelectedTrade('ALL');
            setSearchQuery('');
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row" style={{ minHeight: '560px' }}>

            {/* LEFT: contractor list */}
            <div className="w-full sm:w-[340px] shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {filteredContractors.map((c) => {
                const tradeMeta = getTradeMeta(c.category);
                const Icon = tradeMeta.icon;
                const isSelected = selectedContractor?.id === c.id;

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedContractorId(c.id)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 border-b border-l-4 border-slate-100 cursor-pointer transition-colors block',
                      isSelected ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent hover:bg-slate-50'
                    )}
                  >
                    <div className="text-[14px] font-semibold truncate" style={{ color: isSelected ? '#2563EB' : HEADING }}>{c.name}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5 font-mono">{c.phone}</div>
                    <div className="flex items-center gap-1 font-bold text-[12px] mt-1" style={{ color: HEADING }}>
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{c.rating}</span>
                      <span className="text-slate-500 font-medium ml-1">({c.completedJobs} jobs)</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <Badge variant={tradeMeta.variant}>
                        <Icon className="w-3.5 h-3.5 mr-1" />
                        <span>{c.trade}</span>
                      </Badge>
                      {c.availability === 'AVAILABLE' ? (
                        <Badge variant="emerald">Available</Badge>
                      ) : (
                        <Badge variant="amber">On Active Job</Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: detail panel */}
            <div className="flex-1 min-w-0 p-6 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {selectedContractor && (
                <div className="space-y-6">

                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <Badge variant={getTradeMeta(selectedContractor.category).variant}>
                        {selectedContractor.trade}
                      </Badge>
                      {selectedContractor.availability === 'AVAILABLE' ? (
                        <Badge variant="emerald">Available for Dispatch</Badge>
                      ) : (
                        <Badge variant="amber">On Active Job</Badge>
                      )}
                    </div>
                    <h2 className="text-lg font-bold" style={{ color: HEADING }}>{selectedContractor.name}</h2>
                    <p className="text-[13px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      Specialist Contractor • Contact: {selectedContractor.phone}
                    </p>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Verification & rating */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">Verification &amp; Rating</div>
                      <div className="flex items-center gap-1 font-bold text-sm" style={{ color: HEADING }}>
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>{selectedContractor.rating} Quality Score</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
                      <div><span className="text-slate-400 block">Specialist Trade</span><span className="font-medium" style={{ color: HEADING }}>{selectedContractor.trade}</span></div>
                      <div><span className="text-slate-400 block">Standard Rate / Visit</span><span className="font-medium" style={{ color: HEADING }}>{selectedContractor.standardRate}</span></div>
                      <div><span className="text-slate-400 block">Direct Phone</span><span className="font-medium font-mono" style={{ color: HEADING }}>{selectedContractor.phone}</span></div>
                      <div><span className="text-slate-400 block">CNIC / ID Record</span><span className="font-medium font-mono" style={{ color: HEADING }}>{selectedContractor.cnicNumber || 'Verified on File'}</span></div>
                    </div>

                    <div className="mt-3.5 rounded-xl p-3.5 flex items-center justify-between text-[13px]" style={{ background: '#EEF1FA' }}>
                      <span className="text-slate-500 font-medium">Completed Platform Work Orders</span>
                      <strong className="font-bold text-base" style={{ color: HEADING }}>{selectedContractor.completedJobs} Jobs</strong>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button
                      variant="default"
                      className="w-full sm:flex-1 font-bold text-base h-12"
                      onClick={() => setEditingContractor(selectedContractor)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      <span>Edit Contractor Details</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full sm:w-auto text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-base h-12"
                      onClick={() => {
                        if (confirm(`Remove contractor ${selectedContractor.name} from directory?`)) {
                          deleteContractor(selectedContractor.id);
                          setSelectedContractorId(null);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      <span>Delete</span>
                    </Button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </Card>
      )}

      {/* Add Contractor Modal */}
      {isAddModalOpen && (
        <AddContractorModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddContractor={(data) => {
            addContractor(data);
          }}
        />
      )}

      {/* Edit Contractor Modal */}
      {editingContractor && (
        <EditContractorModal
          isOpen={!!editingContractor}
          contractor={editingContractor}
          onClose={() => setEditingContractor(null)}
          onUpdate={(id, data) => updateContractor(id, data)}
          onDelete={(id) => deleteContractor(id)}
        />
      )}

    </div>
  );
};
