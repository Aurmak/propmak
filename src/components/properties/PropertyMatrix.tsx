'use client';

import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  User, 
  Clock, 
  TrendingUp, 
  Eye,
  Search,
  Filter,
  CheckSquare,
  Square,
  ArrowUpDown,
  Download,
  MessageSquare,
  Receipt,
  Zap,
  Key,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
  UserPlus,
  Check,
  ArrowRight
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { Unit, PropertyStatus, Stakeholder } from '../../types';
import { EmptyState } from '../ui/EmptyState';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AddPropertyModal } from './AddPropertyModal';
import { EditPropertyModal } from './EditPropertyModal';
import { FloorMatrixView } from './FloorMatrixView';
import { Layers, List, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const HEADING = '#1B2559';

const VARIANT_DOT: Record<string, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  purple: 'bg-purple-500',
  teal: 'bg-teal-500',
  destructive: 'bg-rose-500',
  secondary: 'bg-slate-300',
};

interface PropertyMatrixProps {
  onOpenWhatsAppWithMessage?: (msg: string, phone?: string) => void;
}

export const PropertyMatrix: React.FC<PropertyMatrixProps> = ({ 
  onOpenWhatsAppWithMessage 
}) => {
  const { 
    units, 
    stakeholders,
    updateUnit,
    deleteUnit,
    convertSoldToRent, 
    tickets, 
    searchQuery, 
    setSearchQuery,
    assignTenantToUnit 
  } = usePropMAK();
  
  // View Mode: 'table' vs 'floor-matrix'
  const [viewMode, setViewMode] = useState<'table' | 'floor-matrix'>('table');

  // Table Controls State
  const [selectedBuilding, setSelectedBuilding] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'unitNumber' | 'monthlyRent' | 'propertyName' | 'status'>('unitNumber');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [activeInspectorUnit, setActiveInspectorUnit] = useState<Unit | null>(null);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [inspectorTab, setInspectorTab] = useState<string>('overview');

  // Add Property Modal State
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);

  // Quick Assign Tenant State inside Inspector
  const [isAssigningTenant, setIsAssigningTenant] = useState(false);
  const [assignTenantName, setAssignTenantName] = useState('');
  const [assignTenantPhone, setAssignTenantPhone] = useState('');
  const [assignRent, setAssignRent] = useState<number>(120000);
  const [assignDeposit, setAssignDeposit] = useState<number>(240000);
  const [assignStartDate, setAssignStartDate] = useState('2026-09-01');
  const [assignEndDate, setAssignEndDate] = useState('2027-08-31');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Extract unique building list
  const buildings = useMemo(() => {
    const list = Array.from(new Set(units.map(u => u.propertyName)));
    return ['ALL', ...list];
  }, [units]);

  // Filtered & Sorted Units
  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      // Global Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = unit.unitNumber.toLowerCase().includes(q) ||
          unit.propertyName.toLowerCase().includes(q) ||
          unit.location.toLowerCase().includes(q) ||
          unit.owner.name.toLowerCase().includes(q) ||
          (unit.renter?.name && unit.renter.name.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Building Filter
      if (selectedBuilding !== 'ALL' && unit.propertyName !== selectedBuilding) {
        return false;
      }

      // Status Filter
      if (selectedStatusFilter === 'ALL') return true;
      if (selectedStatusFilter === 'RENTED') return unit.status === 'RENTED_DIRECT' || unit.status === 'RENTED_BY_OWNER' || unit.status === 'SOLD_CONVERTED_TO_RENT';
      if (selectedStatusFilter === 'VACANT') return unit.status === 'VACANT_FOR_RENT';
      if (selectedStatusFilter === 'SALES') return unit.status === 'FOR_SALE' || unit.status === 'TOKEN_RECEIVED' || unit.status === 'SOLD_HANDOVER';
      if (selectedStatusFilter === 'SOLD_TO_RENT') return unit.status === 'SOLD_CONVERTED_TO_RENT';
      if (selectedStatusFilter === 'RENOVATION') return unit.status === 'UNDER_RENOVATION';
      return true;
    }).sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [units, searchQuery, selectedBuilding, selectedStatusFilter, sortField, sortAsc]);

  // Paginated Slice
  const totalPages = Math.ceil(filteredUnits.length / pageSize) || 1;
  const paginatedUnits = filteredUnits.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Selected unit for the master-detail panel — always falls back to the first visible row
  const selectedUnit = paginatedUnits.find(u => u.id === activeInspectorUnit?.id) || paginatedUnits[0] || null;

  // Status Badge Helper
  const getStatusBadge = (status: PropertyStatus) => {
    switch (status) {
      case 'RENTED_DIRECT':
        return { label: 'Rented (Direct)', variant: 'emerald' as const };
      case 'RENTED_BY_OWNER':
        return { label: 'Rented (Sublet)', variant: 'blue' as const };
      case 'VACANT_FOR_RENT':
        return { label: 'Vacant — Available', variant: 'amber' as const };
      case 'FOR_SALE':
        return { label: 'For Sale', variant: 'blue' as const };
      case 'TOKEN_RECEIVED':
        return { label: 'Token Deposit', variant: 'purple' as const };
      case 'SOLD_HANDOVER':
        return { label: 'Sold (Handover)', variant: 'secondary' as const };
      case 'SOLD_CONVERTED_TO_RENT':
        return { label: 'Sold-to-Rent', variant: 'teal' as const };
      case 'UNDER_RENOVATION':
        return { label: 'Under Snagging', variant: 'destructive' as const };
      default:
        return { label: status, variant: 'secondary' as const };
    }
  };

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    if (selectedUnitIds.length === paginatedUnits.length) {
      setSelectedUnitIds([]);
    } else {
      setSelectedUnitIds(paginatedUnits.map(u => u.id));
    }
  };

  const toggleSelectUnit = (id: string) => {
    setSelectedUnitIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBatchRentEscalation = () => {
    alert(`⚡ Batch Action: Applied 10% rent escalation notice to ${selectedUnitIds.length} selected units.`);
    setSelectedUnitIds([]);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Unit Ref,Building,Tenant,Monthly Rent,Status\n" +
      filteredUnits.map(u => `"${u.unitNumber}","${u.propertyName}","${u.renter?.name || 'Vacant'}",${u.monthlyRent},"${u.status}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PROPMAK_Unit_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAssignTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit || !assignTenantName) return;

    const newTenant: Stakeholder = {
      id: `usr_renter_${Date.now()}`,
      name: assignTenantName,
      phone: assignTenantPhone || '+1 (555) 000-0000',
      whatsapp: assignTenantPhone,
      location: `${selectedUnit.unitNumber}, ${selectedUnit.propertyName}`,
      role: 'TENANT'
    };

    assignTenantToUnit(
      selectedUnit.id,
      newTenant,
      assignStartDate,
      assignEndDate,
      assignRent,
      assignDeposit,
      10
    );

    setIsAssigningTenant(false);
  };

  return (
    <div className="space-y-5 text-slate-800">
      
      {/* Top Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold" style={{ color: HEADING }}>
                Properties & Tenancies
              </h1>
              <Badge variant="secondary">
                {units.length} Units in Portfolio
              </Badge>
            </div>
            <p className="text-[13px] text-slate-500 mt-1">
              High-density property directory: Buildings, tenancy contracts, annual escalations, and unit inspections
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAddPropertyModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>Add Property</span>
            </Button>
          </div>
        </div>

        {/* View Mode Toggle — contained track, matches MaintenanceHub's hubTab switcher */}
        <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 mt-4 text-[13px]">
          <button
            onClick={() => setViewMode('table')}
            className={cn('flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap',
              viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700')}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table View</span>
          </button>
          <button
            onClick={() => setViewMode('floor-matrix')}
            className={cn('flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap',
              viewMode === 'floor-matrix' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700')}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Floor Matrix</span>
          </button>
        </div>
      </Card>

      {viewMode === 'floor-matrix' ? (
        <FloorMatrixView 
          units={units}
          onSelectUnit={(unit) => {
            setActiveInspectorUnit(unit);
            setIsAssigningTenant(false);
          }}
          onOpenAddPropertyModal={() => setIsAddPropertyModalOpen(true)}
        />
      ) : (
        <>
          {/* Filter & Search Bar */}
          <Card className="p-4 space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              
              {/* Status Filter Tabs — contained track, distinct from status badges */}
              <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-[13px]">
                {[
                  { id: 'ALL', label: `All Units (${units.length})` },
                  { id: 'RENTED', label: 'Rented' },
                  { id: 'VACANT', label: 'Vacant' },
                  { id: 'SALES', label: 'Sales / Token' },
                  { id: 'SOLD_TO_RENT', label: 'Sold-to-Rent' },
                  { id: 'RENOVATION', label: 'Renovation' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedStatusFilter(tab.id);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      'px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap',
                      selectedStatusFilter === tab.id ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Building Faceted Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-slate-500 font-bold uppercase whitespace-nowrap">Development:</span>
                <select
                  value={selectedBuilding}
                  onChange={(e) => {
                    setSelectedBuilding(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border-0 rounded-lg px-3.5 py-1.5 text-[13px] text-slate-700 font-medium focus:outline-none cursor-pointer shadow-[0_1px_4px_rgba(30,42,90,0.08)]"
                >
                  {buildings.map(b => (
                    <option key={b} value={b}>{b === 'ALL' ? 'All Developments' : b}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Bulk Action Sticky Bar */}
            {selectedUnitIds.length > 0 && (
              <div className="p-3 text-white rounded-xl flex items-center justify-between animate-in fade-in text-xs font-medium shadow-md" style={{ background: HEADING }}>
                <div className="flex items-center gap-2">
                  <Badge variant="blue">{selectedUnitIds.length} Selected</Badge>
                  <span>Units selected for batch operations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/10 text-white border-0 hover:bg-white/20 h-8 text-xs"
                    onClick={handleBatchRentEscalation}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                    <span>Batch 10% Rent Escalation</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/10 text-white border-0 hover:bg-white/20 h-8 text-xs"
                    onClick={() => {
                      if (onOpenWhatsAppWithMessage) {
                        onOpenWhatsAppWithMessage(`Broadcast to ${selectedUnitIds.length} units: Routine building maintenance scheduled for this weekend.`);
                      }
                    }}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-white/70 mr-1" />
                    <span>Broadcast Notice</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10 h-8 text-xs"
                    onClick={() => setSelectedUnitIds([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </Card>

      {/* Main Master-Detail Unit Directory */}
      {filteredUnits.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No properties match your filter"
          description="Try adjusting your status filter or clearing your search term to view all portfolio units."
          actionLabel="Clear Search Filter"
          onAction={() => {
            setSelectedStatusFilter('ALL');
            setSelectedBuilding('ALL');
            setSearchQuery('');
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row" style={{ minHeight: '560px' }}>

            {/* LEFT: unit list */}
            <div className="w-full sm:w-[340px] shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 overflow-y-auto" style={{ maxHeight: '720px' }}>

              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 hover:text-slate-800 cursor-pointer"
                  aria-label="Select all units on this page"
                >
                  {selectedUnitIds.length > 0 && selectedUnitIds.length === paginatedUnits.length ? (
                    <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <Square className="w-3.5 h-3.5" />
                  )}
                  <span>Select all ({paginatedUnits.length})</span>
                </button>
                <button
                  onClick={() => { setSortField('unitNumber'); setSortAsc(!sortAsc); }}
                  className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 hover:text-slate-800 cursor-pointer"
                  aria-label="Sort by unit number"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {paginatedUnits.map((unit) => {
                const badge = getStatusBadge(unit.status);
                const isSelected = selectedUnit?.id === unit.id;
                const isChecked = selectedUnitIds.includes(unit.id);
                const unitTickets = tickets.filter(t => t.unitId === unit.id && t.status !== 'COMPLETED');

                return (
                  <div
                    key={unit.id}
                    className={cn(
                      'w-full flex gap-2 px-4 py-3.5 border-b border-l-4 border-slate-100 cursor-pointer transition-colors',
                      isSelected ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent hover:bg-slate-50'
                    )}
                    onClick={() => {
                      setActiveInspectorUnit(unit);
                      setIsAssigningTenant(false);
                    }}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSelectUnit(unit.id); }}
                      className="mt-0.5 shrink-0 text-slate-400 hover:text-slate-900 cursor-pointer"
                      aria-label={`Select ${unit.unitNumber}`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('w-2 h-2 rounded-full shrink-0', VARIANT_DOT[badge.variant] || 'bg-slate-300')} />
                        <span className="text-[12px] text-slate-500 truncate">{unit.propertyType.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-[14px] font-semibold truncate" style={{ color: isSelected ? '#2563EB' : HEADING }}>{unit.unitNumber}</span>
                        {unitTickets.length > 0 && (
                          <Badge variant="destructive">{unitTickets.length} repair</Badge>
                        )}
                      </div>
                      <div className="text-[12px] text-slate-500 truncate">{unit.propertyName} • {unit.location}</div>
                      <div className="text-[12px] text-slate-500 mt-0.5 truncate">
                        {unit.renter ? unit.renter.name : 'Vacant'}
                        {unit.monthlyRent
                          ? ` · Rs. ${unit.monthlyRent.toLocaleString()}/mo`
                          : unit.askingPrice
                          ? ` · Rs. ${(unit.askingPrice / 10000000).toFixed(2)} Cr`
                          : ''}
                      </div>
                      <div className="mt-2">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT: detail panel */}
            <div className="flex-1 min-w-0 p-6 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {selectedUnit && (
                <div className="space-y-6">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <Badge variant={getStatusBadge(selectedUnit.status).variant}>
                          {getStatusBadge(selectedUnit.status).label}
                        </Badge>
                        <span className="text-[12px] text-slate-400 font-mono">{selectedUnit.unitNumber}</span>
                      </div>
                      <h2 className="text-lg font-bold" style={{ color: HEADING }}>{selectedUnit.unitNumber}</h2>
                      <p className="text-[13px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {selectedUnit.propertyName} • {selectedUnit.location}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2.5 text-xs font-bold shrink-0"
                      onClick={() => setEditingUnit(selectedUnit)}
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1 text-slate-700" />
                      <span>Edit Specs</span>
                    </Button>
                  </div>

                  {/* Quick Metrics */}
                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl text-xs" style={{ background: '#EEF1FA' }}>
                    <div>
                      <span className="text-slate-500 uppercase font-bold block">Monthly Rent</span>
                      <span className="text-lg font-bold" style={{ color: HEADING }}>
                        {selectedUnit.monthlyRent ? `Rs. ${selectedUnit.monthlyRent.toLocaleString()}` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase font-bold block">Covered Area</span>
                      <span className="text-sm font-bold" style={{ color: HEADING }}>{selectedUnit.areaSqFt} sq ft</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase font-bold block">Security Deposit</span>
                      <span className="text-sm font-bold text-emerald-700">
                        {selectedUnit.securityDeposit ? `Rs. ${(selectedUnit.securityDeposit / 1000).toFixed(0)}k` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Sub-Tabs — contained track, matches MaintenanceHub's hubTab switcher */}
                  <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                    {[
                      { id: 'overview', label: 'Tenancy & Stakeholders' },
                      { id: 'maintenance', label: `Repairs (${tickets.filter(t => t.unitId === selectedUnit.id).length})` },
                      { id: 'meters', label: 'Meters & Keys' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setInspectorTab(t.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap',
                          inspectorTab === t.id
                            ? 'bg-white text-blue-600 shadow-sm font-semibold'
                            : 'text-slate-500 font-medium hover:text-slate-700'
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab 1: Tenancy & Stakeholders */}
                  {inspectorTab === 'overview' && (
                    <div className="space-y-4 text-sm">

                      <div>
                        <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Owner</div>
                        <div className="p-4 rounded-xl" style={{ background: '#EEF1FA' }}>
                          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                            <span>Property Owner / Landlord</span>
                            <Badge variant="blue">{selectedUnit.owner.role === 'OWNER_OVERSEAS' ? 'Overseas' : 'Local'}</Badge>
                          </div>
                          <p className="font-bold mt-2" style={{ color: HEADING }}>{selectedUnit.owner.name}</p>
                          <p className="text-xs text-slate-500">{selectedUnit.owner.location} • {selectedUnit.owner.phone}</p>
                          {selectedUnit.owner.notes && (
                            <p className="text-xs text-slate-600 mt-2 bg-white p-2 rounded-lg">
                              {selectedUnit.owner.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="h-px bg-slate-100" />

                      <div>
                        <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Tenancy</div>
                        {!selectedUnit.renter || selectedUnit.status === 'VACANT_FOR_RENT' ? (
                          <div className="p-4 rounded-xl bg-amber-50 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-amber-600" />
                                <span className="font-bold text-sm" style={{ color: HEADING }}>Unit Currently Vacant</span>
                              </div>
                              {!isAssigningTenant && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => {
                                    setIsAssigningTenant(true);
                                    setAssignRent(selectedUnit.monthlyRent || 120000);
                                  }}
                                >
                                  <UserPlus className="w-3.5 h-3.5 mr-1" />
                                  <span>Sign New Tenant Lease</span>
                                </Button>
                              )}
                            </div>

                            {isAssigningTenant ? (
                              <form onSubmit={handleAssignTenantSubmit} className="p-4 bg-white rounded-xl space-y-3 text-xs shadow-[0_2px_16px_rgba(30,42,90,0.07)]">
                                <h4 className="font-bold text-xs uppercase tracking-wider" style={{ color: HEADING }}>New Tenancy Agreement Form</h4>

                                <div className="grid grid-cols-2 gap-2.5">
                                  <div>
                                    <label className="block text-slate-700 font-bold mb-1">Tenant Full Name *</label>
                                    <Input
                                      type="text"
                                      value={assignTenantName}
                                      onChange={(e) => setAssignTenantName(e.target.value)}
                                      placeholder="e.g. Imran Hashmi"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-slate-700 font-bold mb-1">Phone / WhatsApp</label>
                                    <Input
                                      type="text"
                                      value={assignTenantPhone}
                                      onChange={(e) => setAssignTenantPhone(e.target.value)}
                                      placeholder="+1 (555) 333-2211"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-slate-700 font-bold mb-1">Monthly Rent (PKR)</label>
                                    <Input
                                      type="number"
                                      value={assignRent}
                                      onChange={(e) => setAssignRent(Number(e.target.value))}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-slate-700 font-bold mb-1">Security Deposit (PKR)</label>
                                    <Input
                                      type="number"
                                      value={assignDeposit}
                                      onChange={(e) => setAssignDeposit(Number(e.target.value))}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-slate-700 font-bold mb-1">Lease Start</label>
                                    <Input
                                      type="date"
                                      value={assignStartDate}
                                      onChange={(e) => setAssignStartDate(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-slate-700 font-bold mb-1">Lease End</label>
                                    <Input
                                      type="date"
                                      value={assignEndDate}
                                      onChange={(e) => setAssignEndDate(e.target.value)}
                                    />
                                  </div>
                                </div>

                                <div className="pt-2 flex items-center justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsAssigningTenant(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    variant="emerald"
                                    size="sm"
                                  >
                                    <Check className="w-3.5 h-3.5 mr-1" />
                                    <span>Confirm & Activate Tenancy</span>
                                  </Button>
                                </div>
                              </form>
                            ) : (
                              <p className="text-xs text-slate-600">
                                This unit has no registered occupant. Click &quot;Sign New Tenant Lease&quot; to link a resident, configure lease dates, and add to the active rent roll.
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl" style={{ background: '#EEF1FA' }}>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                              <span>Renter (Lease Signatory)</span>
                              <Badge variant="emerald">Tenant</Badge>
                            </div>
                            <p className="font-bold mt-2" style={{ color: HEADING }}>
                              {selectedUnit.renter.name}
                            </p>
                            <div className="space-y-1 mt-1 text-xs">
                              <p className="text-slate-500">{selectedUnit.renter.phone}</p>
                              <p className="text-slate-700">Lease Dates: <strong>{selectedUnit.leaseStartDate}</strong> &rarr; <strong>{selectedUnit.leaseEndDate}</strong></p>
                              <p className="text-emerald-700 font-bold">Annual Rent Review: +{selectedUnit.annualEscalationPercent || 10}% Escalation Clause</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {(selectedUnit.renter?.whatsapp || selectedUnit.status === 'FOR_SALE' || selectedUnit.status === 'TOKEN_RECEIVED' || selectedUnit.status === 'SOLD_HANDOVER') && (
                        <>
                          <div className="h-px bg-slate-100" />
                          <div>
                            <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Actions</div>
                            <div className="flex items-center justify-between gap-2">
                              {selectedUnit.renter?.whatsapp && onOpenWhatsAppWithMessage && (
                                <Button
                                  size="sm"
                                  variant="emerald"
                                  className="flex-1 font-bold text-sm"
                                  onClick={() => onOpenWhatsAppWithMessage('Hello, regarding your tenancy...', selectedUnit.renter?.whatsapp)}
                                >
                                  <MessageSquare className="w-4 h-4 mr-1.5" />
                                  <span>Contact Resident</span>
                                </Button>
                              )}

                              {(selectedUnit.status === 'FOR_SALE' || selectedUnit.status === 'TOKEN_RECEIVED' || selectedUnit.status === 'SOLD_HANDOVER') && (
                                <Button
                                  size="sm"
                                  variant="teal"
                                  className="flex-1"
                                  onClick={() => convertSoldToRent(selectedUnit.id, selectedUnit.monthlyRent || 135000)}
                                >
                                  <TrendingUp className="w-4 h-4 mr-1" />
                                  <span>Convert to Managed Rental</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                    </div>
                  )}

                  {/* Tab 2: Maintenance History */}
                  {inspectorTab === 'maintenance' && (
                    <div>
                      <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Repairs</div>
                      <div className="space-y-3 text-sm">
                        {tickets.filter(t => t.unitId === selectedUnit.id).length === 0 ? (
                          <div className="p-6 text-center text-slate-400 rounded-xl text-xs" style={{ background: '#EEF1FA' }}>
                            No active maintenance issues for this unit.
                          </div>
                        ) : (
                          tickets.filter(t => t.unitId === selectedUnit.id).map(ticket => (
                            <div key={ticket.id} className="p-3.5 rounded-xl space-y-2" style={{ background: '#EEF1FA' }}>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs" style={{ color: HEADING }}>{ticket.title}</span>
                                <Badge variant={ticket.urgency === 'EMERGENCY' ? 'destructive' : 'secondary'}>
                                  {ticket.urgency}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-600">{ticket.description}</p>
                              <div className="pt-2 border-t border-white flex items-center justify-between text-xs font-bold" style={{ color: HEADING }}>
                                <span>Est. Cost: Rs. {ticket.totalCost?.toLocaleString() || 0}</span>
                                <span className="text-amber-700">{ticket.status.replace(/_/g, ' ')}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Meters & Keys */}
                  {inspectorTab === 'meters' && (
                    <div>
                      <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Meters &amp; Keys</div>
                      <div className="space-y-2 text-xs p-4 rounded-xl" style={{ background: '#EEF1FA' }}>
                        <div className="flex justify-between py-1.5 border-b border-white">
                          <span className="text-slate-500">Electricity Meter Consumer No:</span>
                          <span className="font-mono font-bold" style={{ color: HEADING }}>{selectedUnit.electricityMeterNo || 'ELEC-00-1122'}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-white">
                          <span className="text-slate-500">Gas Meter Consumer No:</span>
                          <span className="font-mono font-bold" style={{ color: HEADING }}>{selectedUnit.gasMeterNo || 'GAS-00-3344'}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-white">
                          <span className="text-slate-500">Water Account No:</span>
                          <span className="font-mono font-bold" style={{ color: HEADING }}>{selectedUnit.waterAccountNo || 'WTR-00-5566'}</span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-slate-500">Key Safe Location:</span>
                          <span className="font-bold flex items-center gap-1" style={{ color: HEADING }}>
                            <Key className="w-3.5 h-3.5 text-slate-400" />
                            {selectedUnit.keyLocation || 'Agency Safe Drawer'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>

          {/* Pagination Footer */}
          <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-700 font-medium border-t border-slate-100" style={{ background: '#EEF1FA' }}>
            <div className="flex items-center gap-3">
              <span>
                Showing <strong>{((currentPage - 1) * pageSize) + 1}</strong> to <strong>{Math.min(currentPage * pageSize, filteredUnits.length)}</strong> of <strong>{filteredUnits.length}</strong> units
              </span>
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-slate-500 font-bold uppercase text-xs">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border-0 rounded-lg px-2 py-1 text-sm font-bold focus:outline-none cursor-pointer shadow-[0_1px_4px_rgba(30,42,90,0.08)]"
                  style={{ color: HEADING }}
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={1000}>All</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="h-8 px-3 text-sm font-bold bg-white"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <span className="font-bold px-2 text-sm" style={{ color: HEADING }}>Page {currentPage} of {totalPages}</span>
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="h-8 px-3 text-sm font-bold bg-white"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      )}
        </>
      )}

      {/* Add Property & Unit Modal */}
      <AddPropertyModal 
        isOpen={isAddPropertyModalOpen} 
        onClose={() => setIsAddPropertyModalOpen(false)} 
      />

      {/* Edit Property & Unit Modal */}
      {editingUnit && (
        <EditPropertyModal
          isOpen={!!editingUnit}
          unit={editingUnit}
          stakeholders={stakeholders}
          onClose={() => setEditingUnit(null)}
          onUpdate={(id, data) => updateUnit(id, data)}
          onDelete={(id) => deleteUnit(id)}
        />
      )}

    </div>
  );
};
