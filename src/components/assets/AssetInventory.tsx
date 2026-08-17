'use client';

import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trash2,
  ClipboardList,
  Info
} from 'lucide-react';
import { AssetItem, AssetCategory, AssetCondition, AssetStatus } from '../../types';
import { usePropMAK } from '../../context/PropMAKContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ComboBox } from '../ui/ComboBox';
import { TogglePills } from '../ui/TogglePills';
import { EmptyState } from '../ui/EmptyState';
import { cn } from '@/lib/utils';

// ─── Helpers ────────────────────────────────────────────────────────────────

const HEADING = '#1B2559';
const CARD = 'bg-white rounded-2xl shadow-[0_2px_16px_rgba(30,42,90,0.07)]';

const CATEGORY_LABELS: Record<AssetCategory, string> = {
  APPLIANCE: 'Appliance',
  FIXTURE: 'Fixture',
  FURNITURE: 'Furniture',
  FITTING: 'Fitting'
};

const CATEGORY_VARIANTS: Record<AssetCategory, 'blue' | 'secondary' | 'amber' | 'purple'> = {
  APPLIANCE: 'blue',
  FIXTURE: 'secondary',
  FURNITURE: 'amber',
  FITTING: 'purple'
};

const CONDITION_LABELS: Record<AssetCondition, string> = {
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor'
};

const CONDITION_VARIANTS: Record<AssetCondition, 'emerald' | 'amber' | 'secondary' | 'destructive'> = {
  EXCELLENT: 'emerald',
  GOOD: 'emerald',
  FAIR: 'amber',
  POOR: 'destructive'
};

const STATUS_CONFIG: Record<AssetStatus, { label: string; variant: 'emerald' | 'amber' | 'destructive' | 'secondary' }> = {
  ACTIVE: { label: 'Active', variant: 'emerald' },
  DAMAGED: { label: 'Damaged', variant: 'destructive' },
  MISSING: { label: 'Missing', variant: 'destructive' },
  DISPOSED: { label: 'Disposed', variant: 'secondary' }
};

const STATUS_DOT: Record<AssetStatus, string> = {
  ACTIVE: 'bg-emerald-500',
  DAMAGED: 'bg-rose-500',
  MISSING: 'bg-rose-500',
  DISPOSED: 'bg-slate-300'
};

const CONDITION_OPTIONS: { value: AssetCondition; label: string }[] = [
  { value: 'EXCELLENT', label: 'Excellent' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
];

const STATUS_OPTIONS: { value: AssetStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DAMAGED', label: 'Damaged' },
  { value: 'MISSING', label: 'Missing' },
  { value: 'DISPOSED', label: 'Disposed' },
];

// ─── Add Asset Modal ─────────────────────────────────────────────────────────

const AddAssetModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { units, addAsset } = usePropMAK();
  const rentedUnits = units.filter(u => u.status === 'RENTED_DIRECT' || u.status === 'RENTED_BY_OWNER');

  const [unitId, setUnitId] = useState(rentedUnits[0]?.id || '');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('APPLIANCE');
  const [make, setMake] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [moveInCondition, setMoveInCondition] = useState<AssetCondition>('GOOD');
  const [moveInNotes, setMoveInNotes] = useState('');
  const [replacementCost, setReplacementCost] = useState<number>(0);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);

  if (!isOpen) return null;

  const selectedUnit = units.find(u => u.id === unitId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !unitId || !selectedUnit) return;
    addAsset({
      unitId,
      unitName: selectedUnit.unitNumber,
      propertyName: selectedUnit.propertyName,
      name,
      category,
      make: make || undefined,
      serialNumber: serialNumber || undefined,
      moveInCondition,
      moveInNotes: moveInNotes || undefined,
      replacementCost: Number(replacementCost) || 0,
      purchasePrice: Number(purchasePrice) || undefined,
      status: 'ACTIVE'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in text-slate-800 text-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 flex items-center justify-between" style={{ background: '#EEF1FA' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: HEADING }}>Add Asset to Inventory</h3>
              <p className="text-[13px] text-slate-500">Register a new item for a unit</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="font-bold text-sm bg-white">
            Close
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-sm">
          {/* Unit */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 text-sm">Unit</label>
            <ComboBox
              options={units.map(u => ({
                value: u.id,
                label: u.unitNumber,
                sublabel: u.propertyName,
                group: u.propertyName
              }))}
              value={unitId}
              onChange={setUnitId}
              placeholder="Select a unit…"
              searchPlaceholder="Search by unit or property…"
            />
          </div>

          {/* Name + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-sm">Item Name *</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Split AC 1.5 Ton" required className="text-sm bg-white font-medium" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-sm">Category</label>
              <TogglePills
                options={[
                  { value: 'APPLIANCE', label: 'Appliance' },
                  { value: 'FIXTURE', label: 'Fixture' },
                  { value: 'FURNITURE', label: 'Furniture' },
                  { value: 'FITTING', label: 'Fitting' },
                ]}
                value={category}
                onChange={val => setCategory(val as AssetCategory)}
                columns={2}
              />
            </div>
          </div>

          {/* Make + Serial */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-sm">Make / Brand</label>
              <Input value={make} onChange={e => setMake(e.target.value)} placeholder="e.g. Dawlance" className="text-sm bg-white font-medium" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-sm">Serial Number</label>
              <Input value={serialNumber} onChange={e => setSerialNumber(e.target.value)} placeholder="Optional" className="text-sm bg-white font-medium" />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block font-bold text-slate-700 mb-2 text-sm">Move-In Condition</label>
            <TogglePills
              options={CONDITION_OPTIONS}
              value={moveInCondition}
              onChange={val => setMoveInCondition(val as AssetCondition)}
              columns={4}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 text-sm">Move-In Notes</label>
            <Input value={moveInNotes} onChange={e => setMoveInNotes(e.target.value)} placeholder="Any defects noted at move-in" className="text-sm bg-white font-medium" />
          </div>

          {/* Costs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-sm">Purchase Price (Rs.)</label>
              <Input type="number" min="0" value={purchasePrice || ''} onChange={e => setPurchasePrice(Number(e.target.value))} placeholder="0" className="text-sm bg-white font-medium" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-sm">Replacement Cost (Rs.) *</label>
              <Input type="number" min="0" value={replacementCost || ''} onChange={e => setReplacementCost(Number(e.target.value))} placeholder="0" required className="text-sm bg-white font-medium" />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="default">
              <Plus className="w-4 h-4 mr-1.5" />
              Add to Inventory
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const AssetInventory: React.FC = () => {
  const { assets, updateAsset, deleteAsset } = usePropMAK();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<'ALL' | AssetCategory>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | AssetStatus>('ALL');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Move-out recording state
  const [editingMoveOut, setEditingMoveOut] = useState(false);
  const [moveOutCondition, setMoveOutCondition] = useState<AssetCondition>('GOOD');
  const [moveOutNotes, setMoveOutNotes] = useState('');
  const [newStatus, setNewStatus] = useState<AssetStatus>('ACTIVE');

  const filtered = useMemo(() => {
    return assets.filter(a => {
      const matchSearch = !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.unitName.toLowerCase().includes(search.toLowerCase()) ||
        a.propertyName.toLowerCase().includes(search.toLowerCase()) ||
        (a.make?.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = filterCategory === 'ALL' || a.category === filterCategory;
      const matchStatus = filterStatus === 'ALL' || a.status === filterStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [assets, search, filterCategory, filterStatus]);

  const selectedAsset = filtered.find(a => a.id === selectedAssetId) || filtered[0] || null;

  const stats = useMemo(() => ({
    total: assets.length,
    active: assets.filter(a => a.status === 'ACTIVE').length,
    damaged: assets.filter(a => a.status === 'DAMAGED').length,
    missing: assets.filter(a => a.status === 'MISSING').length,
    totalValue: assets.reduce((s, a) => s + a.replacementCost, 0)
  }), [assets]);

  const selectAsset = (asset: AssetItem) => {
    setSelectedAssetId(asset.id);
    setEditingMoveOut(false);
  };

  const startEditMoveOut = () => {
    if (!selectedAsset) return;
    setMoveOutCondition(selectedAsset.moveOutCondition || 'GOOD');
    setMoveOutNotes(selectedAsset.moveOutNotes || '');
    setNewStatus(selectedAsset.status);
    setEditingMoveOut(true);
  };

  const saveMoveOut = () => {
    if (!selectedAsset) return;
    updateAsset(selectedAsset.id, {
      moveOutCondition,
      moveOutNotes,
      status: newStatus
    });
    setEditingMoveOut(false);
  };

  const depositDeduction = (asset: AssetItem): number => {
    if (asset.moveOutCondition === 'POOR') return asset.replacementCost * 0.75;
    if (asset.moveOutCondition === 'FAIR') return asset.replacementCost * 0.25;
    if (asset.status === 'MISSING') return asset.replacementCost;
    return 0;
  };

  return (
    <div className="space-y-6 text-slate-900 text-sm">

      {/* Header */}
      <div className={cn(CARD, 'p-6')}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold" style={{ color: HEADING }}>Asset Inventory</h1>
              <Badge variant="secondary">{stats.total} items</Badge>
            </div>
            <p className="text-[13px] text-slate-500 mt-1">Track furniture, appliances &amp; fixtures per unit</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} variant="default" className="font-bold text-sm shrink-0">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Asset
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
          {[
            { label: 'Total Items', value: stats.total, icon: Package },
            { label: 'Active', value: stats.active, icon: CheckCircle2 },
            { label: 'Damaged', value: stats.damaged, icon: AlertTriangle },
            { label: 'Missing', value: stats.missing, icon: XCircle },
            { label: 'Asset Value', value: `Rs. ${(stats.totalValue / 1000).toFixed(0)}k`, icon: Info }
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3.5 flex items-center gap-3" style={{ background: '#EEF1FA' }}>
              <s.icon className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[12px] text-slate-500 font-medium truncate">{s.label}</div>
                <div className="text-[15px] font-bold truncate" style={{ color: HEADING }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters + Table */}
      <div className={cn(CARD, 'overflow-hidden')}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 px-5 py-4" style={{ background: '#EEF1FA' }}>
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search items, units..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm bg-white"
            />
          </div>

          {/* Category filter — contained track, distinct from status badges */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {(['ALL', 'APPLIANCE', 'FIXTURE', 'FURNITURE', 'FITTING'] as const).map(c => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[13px] transition-colors cursor-pointer whitespace-nowrap',
                  filterCategory === c
                    ? 'bg-white text-blue-600 shadow-sm font-semibold'
                    : 'text-slate-500 font-medium hover:text-slate-700'
                )}
              >
                {c === 'ALL' ? 'All Categories' : CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>

          {/* Status filter — contained track, distinct from status badges */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 lg:ml-auto">
            {(['ALL', 'ACTIVE', 'DAMAGED', 'MISSING', 'DISPOSED'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[13px] transition-colors cursor-pointer whitespace-nowrap',
                  filterStatus === s
                    ? 'bg-white text-blue-600 shadow-sm font-semibold'
                    : 'text-slate-500 font-medium hover:text-slate-700'
                )}
              >
                {s === 'ALL' ? 'All Status' : STATUS_CONFIG[s as AssetStatus]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Master-detail split */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No assets found"
            description="No inventory items match your current filter."
            actionLabel="Reset Filter"
            onAction={() => { setSearch(''); setFilterCategory('ALL'); setFilterStatus('ALL'); }}
          />
        ) : (
          <div className="flex flex-col sm:flex-row" style={{ minHeight: '560px' }}>

            {/* LEFT: asset list */}
            <div className="w-full sm:w-[340px] shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {filtered.map(asset => {
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <button
                    key={asset.id}
                    onClick={() => selectAsset(asset)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 border-b border-l-4 border-slate-100 cursor-pointer transition-colors block',
                      isSelected ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('w-2 h-2 rounded-full shrink-0', STATUS_DOT[asset.status])} />
                      <span className="text-[12px] text-slate-500">{asset.unitName} · {asset.propertyName}</span>
                    </div>
                    <div className="text-[14px] font-semibold truncate" style={{ color: isSelected ? '#2563EB' : HEADING }}>{asset.name}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{asset.make || 'No brand recorded'} · Rs. {asset.replacementCost.toLocaleString()}</div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Badge variant={CATEGORY_VARIANTS[asset.category]} className="text-xs whitespace-nowrap">
                        {CATEGORY_LABELS[asset.category]}
                      </Badge>
                      <Badge variant={STATUS_CONFIG[asset.status].variant} className="text-xs whitespace-nowrap">
                        {STATUS_CONFIG[asset.status].label}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: detail panel */}
            <div className="flex-1 min-w-0 p-6 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {selectedAsset && (
                <div className="space-y-6">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <Badge variant={STATUS_CONFIG[selectedAsset.status].variant} className="text-xs whitespace-nowrap shrink-0">
                          {STATUS_CONFIG[selectedAsset.status].label}
                        </Badge>
                        <Badge variant={CATEGORY_VARIANTS[selectedAsset.category]} className="text-xs whitespace-nowrap shrink-0">
                          {CATEGORY_LABELS[selectedAsset.category]}
                        </Badge>
                      </div>
                      <h2 className="text-lg font-bold" style={{ color: HEADING }}>{selectedAsset.name}</h2>
                      <p className="text-[13px] text-slate-500 mt-0.5">{selectedAsset.unitName} · {selectedAsset.propertyName}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Remove this asset from inventory?')) {
                          deleteAsset(selectedAsset.id);
                          setSelectedAssetId(null);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                      title="Remove from inventory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Item Details */}
                  <div>
                    <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Item details</div>
                    <div className="rounded-xl divide-y divide-white text-sm" style={{ background: '#EEF1FA' }}>
                      {[
                        { label: 'Make / Brand', value: selectedAsset.make || '—' },
                        { label: 'Serial Number', value: selectedAsset.serialNumber || '—' },
                        { label: 'Purchase Price', value: selectedAsset.purchasePrice ? `Rs. ${selectedAsset.purchasePrice.toLocaleString()}` : '—' },
                        { label: 'Replacement Cost', value: `Rs. ${selectedAsset.replacementCost.toLocaleString()}` },
                        { label: 'Logged On', value: selectedAsset.createdAt }
                      ].map(row => (
                        <div key={row.label} className="flex justify-between px-4 py-2.5">
                          <span className="text-slate-500 font-medium text-[13px]">{row.label}</span>
                          <span className="font-semibold text-[13px]" style={{ color: HEADING }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Move-In Condition */}
                  <div>
                    <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5" /> Move-in condition
                    </div>
                    <div className="p-4 rounded-xl space-y-2" style={{ background: '#EEF1FA' }}>
                      <Badge variant={CONDITION_VARIANTS[selectedAsset.moveInCondition]}>
                        {CONDITION_LABELS[selectedAsset.moveInCondition]}
                      </Badge>
                      {selectedAsset.moveInNotes && (
                        <p className="text-[13px] text-slate-600 font-medium">{selectedAsset.moveInNotes}</p>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Move-Out Condition */}
                  <div>
                    <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5" /> Move-out condition
                    </div>

                    {!editingMoveOut ? (
                      <div className="p-4 rounded-xl space-y-2" style={{ background: '#EEF1FA' }}>
                        {selectedAsset.moveOutCondition ? (
                          <>
                            <Badge variant={CONDITION_VARIANTS[selectedAsset.moveOutCondition]}>
                              {CONDITION_LABELS[selectedAsset.moveOutCondition]}
                            </Badge>
                            {selectedAsset.moveOutNotes && (
                              <p className="text-[13px] text-slate-600 font-medium">{selectedAsset.moveOutNotes}</p>
                            )}
                            {depositDeduction(selectedAsset) > 0 && (
                              <div className="mt-2 p-2.5 bg-rose-50 rounded-lg flex justify-between items-center">
                                <span className="text-[12px] font-semibold text-rose-700">Suggested Deposit Deduction</span>
                                <span className="font-bold text-rose-700 text-sm">Rs. {depositDeduction(selectedAsset).toLocaleString()}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-[13px] text-slate-400 italic">Not yet recorded</p>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl space-y-3" style={{ background: '#EEF1FA' }}>
                        {/* Condition picker */}
                        <TogglePills
                          options={CONDITION_OPTIONS}
                          value={moveOutCondition}
                          onChange={val => setMoveOutCondition(val as AssetCondition)}
                          columns={4}
                        />

                        {/* Status */}
                        <div>
                          <label className="block text-[12px] font-semibold text-slate-500 mb-1.5">Update Status</label>
                          <TogglePills
                            options={STATUS_OPTIONS}
                            value={newStatus}
                            onChange={val => setNewStatus(val as AssetStatus)}
                            columns={2}
                          />
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-[12px] font-semibold text-slate-500 mb-1.5">Notes</label>
                          <Input
                            value={moveOutNotes}
                            onChange={e => setMoveOutNotes(e.target.value)}
                            placeholder="Describe condition at move-out"
                            className="text-sm bg-white"
                          />
                        </div>

                        <div className="flex gap-2 pt-1">
                          <Button onClick={saveMoveOut} className="flex-1 h-10 font-bold text-sm">Save Move-Out Record</Button>
                          <Button variant="outline" onClick={() => setEditingMoveOut(false)} className="h-10 font-bold text-sm bg-white">Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary CTA */}
                  {!editingMoveOut && (
                    <Button
                      onClick={startEditMoveOut}
                      className="w-full h-12 font-bold text-base"
                    >
                      <ClipboardList className="w-4 h-4 mr-2" />
                      {selectedAsset.moveOutCondition ? 'Update Move-Out Condition' : 'Record Move-Out Condition'}
                    </Button>
                  )}

                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Add Modal */}
      <AddAssetModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};
