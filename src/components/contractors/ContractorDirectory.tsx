'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Phone, 
  Wrench, 
  Droplets, 
  Zap, 
  Wind, 
  Paintbrush, 
  Key, 
  Star, 
  Plus, 
  CheckCircle2,
  Search,
  Filter,
  Edit2,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Briefcase
} from 'lucide-react';
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
import { usePropMAK } from '../../context/PropMAKContext';
import { AddContractorModal } from './AddContractorModal';
import { EditContractorModal } from './EditContractorModal';
import { Contractor, TradeCategory } from '../../types';

export const ContractorDirectory: React.FC = () => {
  const { contractors, addContractor, updateContractor, deleteContractor, searchQuery, setSearchQuery } = usePropMAK();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const [activeInspectorContractor, setActiveInspectorContractor] = useState<Contractor | null>(null);
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Verified Contractors & Trade Directory
              </h1>
              <Badge variant="secondary">
                {contractors.length} Verified Trades
              </Badge>
            </div>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Vetted trade specialists: Electricians, Plumbers, HVAC mechanics, and Carpenters
            </p>
          </div>

          <Button
            variant="default"
            onClick={() => setIsAddModalOpen(true)}
            className="font-bold text-sm"
          >
            <Plus className="w-4 h-4 text-amber-400 mr-1.5" />
            <span>Onboard Contractor</span>
          </Button>
        </div>
      </Card>

      {/* Filter Toolbar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Trade Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto text-sm">
            {[
              { id: 'ALL', label: `All Trades (${contractors.length})` },
              { id: 'PLUMBER_PUMP_GEYSER', label: 'Plumbing & Pumps', icon: Droplets },
              { id: 'ELECTRICIAN_UPS', label: 'Electrical & DB', icon: Zap },
              { id: 'AC_TECHNICIAN', label: 'HVAC & AC', icon: Wind },
              { id: 'PAINTER_SEEPAGE', label: 'Painting', icon: Paintbrush },
              { id: 'CARPENTER_LOCKS', label: 'Carpentry', icon: Key }
            ].map(tab => (
              <Button
                key={tab.id}
                size="sm"
                variant={selectedTrade === tab.id ? 'default' : 'ghost'}
                onClick={() => setSelectedTrade(tab.id)}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contractor name, phone, trade..."
              className="pl-9 h-9 text-sm bg-white font-medium"
            />
          </div>

        </div>
      </Card>

      {/* Streamlined 5-Column Contractors Table */}
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
        <Card className="overflow-hidden shadow-sm">
          <Table aria-label="Contractor Trade Directory">
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-sm">Contractor & Trade</TableHead>
                <TableHead className="font-bold text-sm">Contact Phone</TableHead>
                <TableHead className="font-bold text-sm">Rating & Track Record</TableHead>
                <TableHead className="font-bold text-sm">Availability</TableHead>
                <TableHead className="text-right font-bold text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContractors.map((c) => {
                const tradeMeta = getTradeMeta(c.category);
                const Icon = tradeMeta.icon;

                return (
                  <TableRow 
                    key={c.id} 
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setActiveInspectorContractor(c)}
                  >
                    
                    {/* Column 1: Contractor & Trade */}
                    <TableCell>
                      <span className="font-bold text-slate-900 text-sm block">{c.name}</span>
                      <div className="mt-1">
                        <Badge variant={tradeMeta.variant}>
                          <Icon className="w-3.5 h-3.5 mr-1" />
                          <span>{c.trade}</span>
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Column 2: Phone */}
                    <TableCell className="font-mono text-sm font-semibold text-slate-900">
                      {c.phone}
                    </TableCell>

                    {/* Column 3: Rating & Completed Jobs */}
                    <TableCell>
                      <div className="flex items-center gap-1 font-bold text-amber-900 text-sm">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>{c.rating}</span>
                        <span className="text-slate-500 font-medium text-sm ml-1.5">({c.completedJobs} jobs done)</span>
                      </div>
                    </TableCell>

                    {/* Column 4: Availability */}
                    <TableCell>
                      {c.availability === 'AVAILABLE' ? (
                        <Badge variant="emerald">Available</Badge>
                      ) : (
                        <Badge variant="amber">On Active Job</Badge>
                      )}
                    </TableCell>

                    {/* Column 5: Action */}
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-bold text-sm h-8 px-3"
                        onClick={() => setActiveInspectorContractor(c)}
                      >
                        <span>View Profile</span>
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

      {/* Slide-Over Contractor Inspector Drawer (`Sheet`) */}
      <Sheet open={!!activeInspectorContractor} onOpenChange={(open) => { if (!open) setActiveInspectorContractor(null); }}>
        {activeInspectorContractor && (
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            
            <SheetHeader className="pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <Badge variant={getTradeMeta(activeInspectorContractor.category).variant}>
                  {activeInspectorContractor.trade}
                </Badge>
                {activeInspectorContractor.availability === 'AVAILABLE' ? (
                  <Badge variant="emerald">Available for Dispatch</Badge>
                ) : (
                  <Badge variant="amber">On Active Job</Badge>
                )}
              </div>
              <SheetTitle className="text-xl font-black text-slate-900">{activeInspectorContractor.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-1.5 text-slate-700 font-medium text-sm mt-1">
                <Briefcase className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Specialist Contractor • Contact: {activeInspectorContractor.phone}</span>
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 my-5 text-sm text-slate-800">
              
              {/* Profile Overview Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verification & Rating</span>
                  <div className="flex items-center gap-1 text-amber-900 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{activeInspectorContractor.rating} Quality Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600 font-medium block">Specialist Trade:</span>
                    <strong className="text-slate-900 block">{activeInspectorContractor.trade}</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium block">Standard Rate / Visit:</span>
                    <strong className="text-slate-900 block">{activeInspectorContractor.standardRate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium block">Direct Phone:</span>
                    <strong className="text-slate-900 font-mono block">{activeInspectorContractor.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium block">CNIC / ID Record:</span>
                    <strong className="text-slate-900 font-mono block">{activeInspectorContractor.cnicNumber || 'Verified on File'}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Completed Platform Work Orders:</span>
                  <strong className="text-slate-950 font-black text-base">{activeInspectorContractor.completedJobs} Jobs</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  variant="default"
                  className="w-full sm:flex-1 font-bold text-base h-12"
                  onClick={() => {
                    setEditingContractor(activeInspectorContractor);
                    setActiveInspectorContractor(null);
                  }}
                >
                  <Edit2 className="w-4 h-4 mr-2 text-amber-400" />
                  <span>Edit Contractor Details</span>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full sm:w-auto text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-base h-12"
                  onClick={() => {
                    if (confirm(`Remove contractor ${activeInspectorContractor.name} from directory?`)) {
                      deleteContractor(activeInspectorContractor.id);
                      setActiveInspectorContractor(null);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  <span>Delete</span>
                </Button>
              </div>

            </div>

          </SheetContent>
        )}
      </Sheet>

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
