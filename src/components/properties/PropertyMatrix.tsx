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
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '../ui/sheet';
import { AddPropertyModal } from './AddPropertyModal';
import { EditPropertyModal } from './EditPropertyModal';
import { FloorMatrixView } from './FloorMatrixView';
import { Layers, List, Edit2, Trash2 } from 'lucide-react';

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
    if (!activeInspectorUnit || !assignTenantName) return;

    const newTenant: Stakeholder = {
      id: `usr_renter_${Date.now()}`,
      name: assignTenantName,
      phone: assignTenantPhone || '+1 (555) 000-0000',
      whatsapp: assignTenantPhone,
      location: `${activeInspectorUnit.unitNumber}, ${activeInspectorUnit.propertyName}`,
      role: 'TENANT'
    };

    assignTenantToUnit(
      activeInspectorUnit.id,
      newTenant,
      assignStartDate,
      assignEndDate,
      assignRent,
      assignDeposit,
      10
    );

    setIsAssigningTenant(false);
    setActiveInspectorUnit(null);
  };

  return (
    <div className="space-y-5 text-slate-800">
      
      {/* Top Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Properties & Tenancies
              </h1>
              <Badge variant="secondary">
                {units.length} Units in Portfolio
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              High-density property directory: Buildings, tenancy contracts, annual escalations, and unit inspections
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table View</span>
              </button>
              <button
                onClick={() => setViewMode('floor-matrix')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'floor-matrix' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Floor Matrix</span>
              </button>
            </div>

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
              <Plus className="w-4 h-4 text-amber-400 mr-1" />
              <span>Add Property</span>
            </Button>
          </div>
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
              
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-sm">
                {[
                  { id: 'ALL', label: `All Units (${units.length})` },
                  { id: 'RENTED', label: 'Rented' },
                  { id: 'VACANT', label: 'Vacant' },
                  { id: 'SALES', label: 'Sales / Token' },
                  { id: 'SOLD_TO_RENT', label: 'Sold-to-Rent' },
                  { id: 'RENOVATION', label: 'Renovation' }
                ].map(tab => (
                  <Button
                    key={tab.id}
                    size="sm"
                    variant={selectedStatusFilter === tab.id ? 'default' : 'ghost'}
                    onClick={() => {
                      setSelectedStatusFilter(tab.id);
                      setCurrentPage(1);
                    }}
                    className="h-9 px-3 text-xs"
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              {/* Building Faceted Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold uppercase whitespace-nowrap">Development:</span>
                <select
                  value={selectedBuilding}
                  onChange={(e) => {
                    setSelectedBuilding(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-800"
                >
                  {buildings.map(b => (
                    <option key={b} value={b}>{b === 'ALL' ? 'All Developments' : b}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Bulk Action Sticky Bar */}
            {selectedUnitIds.length > 0 && (
              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between animate-in fade-in text-xs font-medium shadow-md">
                <div className="flex items-center gap-2">
                  <Badge variant="amber">{selectedUnitIds.length} Selected</Badge>
                  <span>Units selected for batch operations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 h-8 text-xs"
                    onClick={handleBatchRentEscalation}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                    <span>Batch 10% Rent Escalation</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 h-8 text-xs"
                    onClick={() => {
                      if (onOpenWhatsAppWithMessage) {
                        onOpenWhatsAppWithMessage(`Broadcast to ${selectedUnitIds.length} units: Routine building maintenance scheduled for this weekend.`);
                      }
                    }}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400 mr-1" />
                    <span>Broadcast Notice</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-white h-8 text-xs"
                    onClick={() => setSelectedUnitIds([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </Card>

      {/* Main High-Density Fixflo-Style Table */}
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
        <Card className="overflow-hidden shadow-sm">
          <Table aria-label="Properties and Units Directory">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <button 
                    onClick={handleSelectAll} 
                    className="flex items-center justify-center p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                    aria-label="Select all units on this page"
                  >
                    {selectedUnitIds.length > 0 && selectedUnitIds.length === paginatedUnits.length ? (
                      <CheckSquare className="w-4 h-4 text-slate-900" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </TableHead>

                <TableHead 
                  className="cursor-pointer select-none font-bold text-sm"
                  onClick={() => { setSortField('unitNumber'); setSortAsc(!sortAsc); }}
                >
                  <div className="flex items-center gap-1">
                    <span>Unit & Development</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </TableHead>

                <TableHead className="font-bold text-sm">Specs & Type</TableHead>

                <TableHead className="font-bold text-sm">Tenant / Occupier</TableHead>

                <TableHead 
                  className="cursor-pointer select-none font-bold text-sm"
                  onClick={() => { setSortField('monthlyRent'); setSortAsc(!sortAsc); }}
                >
                  <div className="flex items-center gap-1">
                    <span>Rent & Status</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </TableHead>

                <TableHead className="text-right font-bold text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUnits.map((unit) => {
                const badge = getStatusBadge(unit.status);
                const isSelected = selectedUnitIds.includes(unit.id);
                const unitTickets = tickets.filter(t => t.unitId === unit.id && t.status !== 'COMPLETED');

                return (
                  <TableRow 
                    key={unit.id}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                    onClick={() => {
                      setActiveInspectorUnit(unit);
                      setIsAssigningTenant(false);
                    }}
                  >
                    {/* Checkbox */}
                    <TableCell onClick={(e) => { e.stopPropagation(); toggleSelectUnit(unit.id); }}>
                      <button 
                        className="flex items-center justify-center p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                        aria-label={`Select ${unit.unitNumber}`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-slate-900" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </TableCell>

                    {/* Column 1: Unit Ref & Development */}
                    <TableCell>
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{unit.unitNumber}</span>
                        {unitTickets.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-950 text-xs font-bold border border-rose-300">
                            {unitTickets.length} open repair
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-slate-600 font-medium block">
                        {unit.propertyName} • {unit.location}
                      </span>
                    </TableCell>

                    {/* Column 2: Specs & Type */}
                    <TableCell>
                      <span className="font-semibold text-slate-900 text-sm block">
                        {unit.propertyType.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm text-slate-500 font-medium block">
                        {unit.areaSqFt} sq ft {unit.bedrooms ? `• ${unit.bedrooms} Bed` : ''}
                      </span>
                    </TableCell>

                    {/* Column 3: Tenant */}
                    <TableCell>
                      {unit.renter ? (
                        <div>
                          <span className="font-bold text-slate-900 block text-sm">{unit.renter.name}</span>
                          <span className="text-sm text-slate-500 font-medium block">{unit.renter.phone}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-950 font-bold bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                          — Vacant —
                        </span>
                      )}
                    </TableCell>

                    {/* Column 4: Monthly Rent & Status */}
                    <TableCell>
                      <span className="text-base font-black text-slate-950 block">
                        {unit.monthlyRent 
                          ? `Rs. ${unit.monthlyRent.toLocaleString()} / mo` 
                          : unit.askingPrice 
                          ? `Rs. ${(unit.askingPrice / 10000000).toFixed(2)} Cr` 
                          : '—'}
                      </span>
                      <div className="mt-1">
                        <Badge variant={badge.variant}>
                          {badge.label}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Column 5: Action */}
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-bold text-sm h-8 px-3"
                        onClick={() => {
                          setActiveInspectorUnit(unit);
                          setIsAssigningTenant(false);
                        }}
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 text-amber-500" />
                      </Button>
                    </TableCell>

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Table Pagination Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-700 font-medium">
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
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-800 cursor-pointer"
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
                className="h-8 px-3 text-sm font-bold"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <span className="font-bold text-slate-900 px-2 text-sm">Page {currentPage} of {totalPages}</span>
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="h-8 px-3 text-sm font-bold"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      )}
        </>
      )}

      {/* Slide-Over Inspector Drawer */}
      <Sheet open={!!activeInspectorUnit} onOpenChange={(open) => { if (!open) setActiveInspectorUnit(null); }}>
        {activeInspectorUnit && (
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            
            <SheetHeader className="pb-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={getStatusBadge(activeInspectorUnit.status).variant}>
                    {getStatusBadge(activeInspectorUnit.status).label}
                  </Badge>
                  <span className="text-xs text-slate-500 font-mono">{activeInspectorUnit.unitNumber}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2.5 text-xs font-bold"
                  onClick={() => {
                    setEditingUnit(activeInspectorUnit);
                    setActiveInspectorUnit(null);
                  }}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1 text-slate-700" />
                  <span>Edit Specs</span>
                </Button>
              </div>
              <SheetTitle>{activeInspectorUnit.unitNumber}</SheetTitle>
              <SheetDescription className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{activeInspectorUnit.propertyName} • {activeInspectorUnit.location}</span>
              </SheetDescription>
            </SheetHeader>

            {/* Quick Metrics Bar inside Drawer */}
            <div className="grid grid-cols-3 gap-3 my-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 uppercase font-bold block">Monthly Rent</span>
                <span className="text-lg font-extrabold text-slate-900">
                  {activeInspectorUnit.monthlyRent ? `Rs. ${activeInspectorUnit.monthlyRent.toLocaleString()}` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-bold block">Covered Area</span>
                <span className="text-sm font-bold text-slate-800">{activeInspectorUnit.areaSqFt} sq ft</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-bold block">Security Deposit</span>
                <span className="text-sm font-bold text-emerald-700">
                  {activeInspectorUnit.securityDeposit ? `Rs. ${(activeInspectorUnit.securityDeposit / 1000).toFixed(0)}k` : 'N/A'}
                </span>
              </div>
            </div>

            {/* Sub-Tabs inside Inspector */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 text-xs font-bold">
                {[
                  { id: 'overview', label: 'Tenancy & Stakeholders' },
                  { id: 'maintenance', label: `Repairs (${tickets.filter(t => t.unitId === activeInspectorUnit.id).length})` },
                  { id: 'meters', label: 'Meters & Keys' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setInspectorTab(t.id)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      inspectorTab === t.id 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Inspector Tab 1: Tenancy & Stakeholders */}
              {inspectorTab === 'overview' && (
                <div className="space-y-4 text-sm">
                  
                  {/* Landlord Card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                      <span>Property Owner / Landlord</span>
                      <Badge variant="blue">{activeInspectorUnit.owner.role === 'OWNER_OVERSEAS' ? 'Overseas' : 'Local'}</Badge>
                    </div>
                    <p className="font-bold text-slate-900 mt-2">{activeInspectorUnit.owner.name}</p>
                    <p className="text-xs text-slate-500">{activeInspectorUnit.owner.location} • {activeInspectorUnit.owner.phone}</p>
                    {activeInspectorUnit.owner.notes && (
                      <p className="text-xs text-slate-600 mt-2 bg-white p-2 rounded border border-slate-200">
                        {activeInspectorUnit.owner.notes}
                      </p>
                    )}
                  </div>

                  {/* Tenant Card or Quick Assign Tenant Form */}
                  {!activeInspectorUnit.renter || activeInspectorUnit.status === 'VACANT_FOR_RENT' ? (
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-5 h-5 text-amber-600" />
                          <span className="font-bold text-slate-900 text-sm">Unit Currently Vacant</span>
                        </div>
                        {!isAssigningTenant && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              setIsAssigningTenant(true);
                              setAssignRent(activeInspectorUnit.monthlyRent || 120000);
                            }}
                          >
                            <UserPlus className="w-3.5 h-3.5 mr-1" />
                            <span>Sign New Tenant Lease</span>
                          </Button>
                        )}
                      </div>

                      {isAssigningTenant ? (
                        <form onSubmit={handleAssignTenantSubmit} className="p-4 bg-white rounded-xl border border-amber-300 space-y-3 text-xs">
                          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">New Tenancy Agreement Form</h4>
                          
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
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                        <span>Renter (Lease Signatory)</span>
                        <Badge variant="emerald">Tenant</Badge>
                      </div>
                      <p className="font-bold text-slate-900 mt-2">
                        {activeInspectorUnit.renter.name}
                      </p>
                      <div className="space-y-1 mt-1 text-xs">
                        <p className="text-slate-500">{activeInspectorUnit.renter.phone}</p>
                        <p className="text-slate-700">Lease Dates: <strong>{activeInspectorUnit.leaseStartDate}</strong> &rarr; <strong>{activeInspectorUnit.leaseEndDate}</strong></p>
                        <p className="text-emerald-700 font-bold">Annual Rent Review: +{activeInspectorUnit.annualEscalationPercent || 10}% Escalation Clause</p>
                      </div>
                    </div>
                  )}

                  {/* Actions Footer inside Drawer */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    {activeInspectorUnit.renter?.whatsapp && onOpenWhatsAppWithMessage && (
                      <Button
                        size="sm"
                        variant="emerald"
                        className="flex-1 font-bold text-sm"
                        onClick={() => onOpenWhatsAppWithMessage('Hello, regarding your tenancy...', activeInspectorUnit.renter?.whatsapp)}
                      >
                        <MessageSquare className="w-4 h-4 mr-1.5" />
                        <span>Contact Resident</span>
                      </Button>
                    )}

                    {(activeInspectorUnit.status === 'FOR_SALE' || activeInspectorUnit.status === 'TOKEN_RECEIVED' || activeInspectorUnit.status === 'SOLD_HANDOVER') && (
                      <Button
                        size="sm"
                        variant="teal"
                        className="flex-1"
                        onClick={() => {
                          convertSoldToRent(activeInspectorUnit.id, activeInspectorUnit.monthlyRent || 135000);
                          setActiveInspectorUnit(null);
                        }}
                      >
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>Convert to Managed Rental</span>
                      </Button>
                    )}
                  </div>

                </div>
              )}

              {/* Inspector Tab 2: Maintenance History */}
              {inspectorTab === 'maintenance' && (
                <div className="space-y-3 text-sm">
                  {tickets.filter(t => t.unitId === activeInspectorUnit.id).length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      No active maintenance issues for this unit.
                    </div>
                  ) : (
                    tickets.filter(t => t.unitId === activeInspectorUnit.id).map(ticket => (
                      <div key={ticket.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">{ticket.title}</span>
                          <Badge variant={ticket.urgency === 'EMERGENCY' ? 'destructive' : 'secondary'}>
                            {ticket.urgency}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600">{ticket.description}</p>
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>Est. Cost: Rs. {ticket.totalCost?.toLocaleString() || 0}</span>
                          <span className="text-amber-700">{ticket.status.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Inspector Tab 3: Meters & Keys */}
              {inspectorTab === 'meters' && (
                <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-500">Electricity Meter Consumer No:</span>
                    <span className="font-mono font-bold text-slate-900">{activeInspectorUnit.electricityMeterNo || 'ELEC-00-1122'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-500">Gas Meter Consumer No:</span>
                    <span className="font-mono font-bold text-slate-900">{activeInspectorUnit.gasMeterNo || 'GAS-00-3344'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-500">Water Account No:</span>
                    <span className="font-mono font-bold text-slate-900">{activeInspectorUnit.waterAccountNo || 'WTR-00-5566'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Key Safe Location:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-amber-500" />
                      {activeInspectorUnit.keyLocation || 'Agency Safe Drawer'}
                    </span>
                  </div>
                </div>
              )}

            </div>

          </SheetContent>
        )}
      </Sheet>

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
