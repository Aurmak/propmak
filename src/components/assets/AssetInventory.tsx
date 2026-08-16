'use client';

import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trash2,
  ClipboardList,
  X,
  Info
} from 'lucide-react';
import { AssetItem, AssetCategory, AssetCondition, AssetStatus } from '../../types';
import { usePropMAK } from '../../context/PropMAKContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ComboBox } from '../ui/ComboBox';
import { TogglePills } from '../ui/TogglePills';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '../ui/sheet';

// ─── Helpers ────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<AssetCategory, string> = {
  APPLIANCE: 'Appliance',
  FIXTURE: 'Fixture',
  FURNITURE: 'Furniture',
  FITTING: 'Fitting'
};

const CATEGORY_COLORS: Record<AssetCategory, string> = {
  APPLIANCE: 'bg-blue-50 text-blue-700 border-blue-200',
  FIXTURE: 'bg-slate-100 text-slate-700 border-slate-200',
  FURNITURE: 'bg-amber-50 text-amber-700 border-amber-200',
  FITTING: 'bg-purple-50 text-purple-700 border-purple-200'
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in text-slate-800">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <Package className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Add Asset to Inventory</h3>
              <p className="text-xs text-slate-500">Register a new item for a unit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-sm">
          {/* Unit */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">Unit</label>
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
              <label className="block font-bold text-slate-800 mb-1.5">Item Name *</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Split AC 1.5 Ton" required />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Category</label>
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
              <label className="block font-bold text-slate-800 mb-1.5">Make / Brand</label>
              <Input value={make} onChange={e => setMake(e.target.value)} placeholder="e.g. Dawlance" />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Serial Number</label>
              <Input value={serialNumber} onChange={e => setSerialNumber(e.target.value)} placeholder="Optional" />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">Move-In Condition</label>
            <div className="grid grid-cols-4 gap-2">
              {(['EXCELLENT', 'GOOD', 'FAIR', 'POOR'] as AssetCondition[]).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setMoveInCondition(c)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    moveInCondition === c
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {CONDITION_LABELS[c]}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">Move-In Notes</label>
            <Input value={moveInNotes} onChange={e => setMoveInNotes(e.target.value)} placeholder="Any defects noted at move-in" />
          </div>

          {/* Costs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Purchase Price (Rs.)</label>
              <Input type="number" min="0" value={purchasePrice || ''} onChange={e => setPurchasePrice(Number(e.target.value))} placeholder="0" />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Replacement Cost (Rs.) *</label>
              <Input type="number" min="0" value={replacementCost || ''} onChange={e => setReplacementCost(Number(e.target.value))} placeholder="0" required />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="default">
              <Plus className="w-4 h-4 text-amber-400 mr-1.5" />
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
  const [activeInspector, setActiveInspector] = useState<AssetItem | null>(null);
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

  const stats = useMemo(() => ({
    total: assets.length,
    active: assets.filter(a => a.status === 'ACTIVE').length,
    damaged: assets.filter(a => a.status === 'DAMAGED').length,
    missing: assets.filter(a => a.status === 'MISSING').length,
    totalValue: assets.reduce((s, a) => s + a.replacementCost, 0)
  }), [assets]);

  const openInspector = (asset: AssetItem) => {
    setActiveInspector(asset);
    setEditingMoveOut(false);
    setMoveOutCondition(asset.moveOutCondition || 'GOOD');
    setMoveOutNotes(asset.moveOutNotes || '');
    setNewStatus(asset.status);
  };

  const saveMoveOut = () => {
    if (!activeInspector) return;
    updateAsset(activeInspector.id, {
      moveOutCondition,
      moveOutNotes,
      status: newStatus
    });
    setActiveInspector(prev => prev ? { ...prev, moveOutCondition, moveOutNotes, status: newStatus } : null);
    setEditingMoveOut(false);
  };

  const depositDeduction = (asset: AssetItem): number => {
    if (asset.moveOutCondition === 'POOR') return asset.replacementCost * 0.75;
    if (asset.moveOutCondition === 'FAIR') return asset.replacementCost * 0.25;
    if (asset.status === 'MISSING') return asset.replacementCost;
    return 0;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Asset Inventory</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Track furniture, appliances &amp; fixtures per unit</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="default" className="h-10 font-bold text-sm shrink-0">
          <Plus className="w-4 h-4 text-amber-400 mr-1.5" />
          Add Asset
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-5 divide-x divide-slate-200 border-b border-slate-200 bg-white shrink-0">
        {[
          { label: 'Total Items', value: stats.total, icon: Package },
          { label: 'Active', value: stats.active, icon: CheckCircle2 },
          { label: 'Damaged', value: stats.damaged, icon: AlertTriangle },
          { label: 'Missing', value: stats.missing, icon: XCircle },
          { label: 'Replacement Value', value: `Rs. ${(stats.totalValue / 1000).toFixed(0)}k`, icon: Info }
        ].map(s => (
          <div key={s.label} className="px-5 py-3 flex items-center gap-3">
            <s.icon className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              <div className="text-base font-extrabold text-slate-900">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-3 shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search items, units..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm bg-slate-50"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['ALL', 'APPLIANCE', 'FIXTURE', 'FURNITURE', 'FITTING'] as const).map(c => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === c
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c === 'ALL' ? 'All Categories' : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 ml-auto">
          {(['ALL', 'ACTIVE', 'DAMAGED', 'MISSING', 'DISPOSED'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === s
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s === 'ALL' ? 'All Status' : STATUS_CONFIG[s as AssetStatus]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <tr>
              {['Unit', 'Item', 'Category', 'Move-In Condition', 'Status', 'Replacement Cost', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-500">No assets found</p>
                  <p className="text-xs text-slate-400 mt-1">Add your first item using the button above</p>
                </td>
              </tr>
            ) : filtered.map(asset => (
              <tr
                key={asset.id}
                onClick={() => openInspector(asset)}
                className="hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900 text-sm truncate max-w-[140px]">{asset.unitName}</div>
                  <div className="text-xs text-slate-400 truncate">{asset.propertyName}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900 truncate max-w-[160px]">{asset.name}</div>
                  {asset.make && <div className="text-xs text-slate-400">{asset.make}</div>}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${CATEGORY_COLORS[asset.category]}`}>
                    {CATEGORY_LABELS[asset.category]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={CONDITION_VARIANTS[asset.moveInCondition]} className="text-xs whitespace-nowrap">
                    {CONDITION_LABELS[asset.moveInCondition]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_CONFIG[asset.status].variant} className="text-xs whitespace-nowrap">
                    {STATUS_CONFIG[asset.status].label}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">
                  Rs. {asset.replacementCost.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side Panel */}
      <Sheet open={!!activeInspector} onOpenChange={open => !open && setActiveInspector(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
          {activeInspector && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <Badge variant={STATUS_CONFIG[activeInspector.status].variant} className="text-xs whitespace-nowrap shrink-0">
                    {STATUS_CONFIG[activeInspector.status].label}
                  </Badge>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border shrink-0 ${CATEGORY_COLORS[activeInspector.category]}`}>
                    {CATEGORY_LABELS[activeInspector.category]}
                  </span>
                </div>
                <SheetTitle className="text-xl font-extrabold">{activeInspector.name}</SheetTitle>
                <SheetDescription>{activeInspector.unitName} · {activeInspector.propertyName}</SheetDescription>
              </SheetHeader>

              <div className="px-6 pb-6 space-y-5">

                {/* Item Details */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-100 text-sm">
                  {[
                    { label: 'Make / Brand', value: activeInspector.make || '—' },
                    { label: 'Serial Number', value: activeInspector.serialNumber || '—' },
                    { label: 'Purchase Price', value: activeInspector.purchasePrice ? `Rs. ${activeInspector.purchasePrice.toLocaleString()}` : '—' },
                    { label: 'Replacement Cost', value: `Rs. ${activeInspector.replacementCost.toLocaleString()}` },
                    { label: 'Logged On', value: activeInspector.createdAt }
                  ].map(row => (
                    <div key={row.label} className="flex justify-between px-4 py-2.5">
                      <span className="text-slate-500 font-medium">{row.label}</span>
                      <span className="font-bold text-slate-900">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Move-In Condition */}
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-slate-500" /> Move-In Condition
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <Badge variant={CONDITION_VARIANTS[activeInspector.moveInCondition]}>
                      {CONDITION_LABELS[activeInspector.moveInCondition]}
                    </Badge>
                    {activeInspector.moveInNotes && (
                      <p className="text-sm text-slate-600 font-medium">{activeInspector.moveInNotes}</p>
                    )}
                  </div>
                </div>

                {/* Move-Out Condition */}
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-slate-500" /> Move-Out Condition
                  </h3>

                  {!editingMoveOut ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      {activeInspector.moveOutCondition ? (
                        <>
                          <Badge variant={CONDITION_VARIANTS[activeInspector.moveOutCondition]}>
                            {CONDITION_LABELS[activeInspector.moveOutCondition]}
                          </Badge>
                          {activeInspector.moveOutNotes && (
                            <p className="text-sm text-slate-600 font-medium">{activeInspector.moveOutNotes}</p>
                          )}
                          {depositDeduction(activeInspector) > 0 && (
                            <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex justify-between items-center">
                              <span className="text-xs font-bold text-rose-700">Suggested Deposit Deduction</span>
                              <span className="font-extrabold text-rose-800 text-sm">Rs. {depositDeduction(activeInspector).toLocaleString()}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-slate-400 italic">Not yet recorded</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      {/* Condition picker */}
                      <div className="grid grid-cols-4 gap-1.5">
                        {(['EXCELLENT', 'GOOD', 'FAIR', 'POOR'] as AssetCondition[]).map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setMoveOutCondition(c)}
                            className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              moveOutCondition === c
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {CONDITION_LABELS[c]}
                          </button>
                        ))}
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Update Status</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(['ACTIVE', 'DAMAGED', 'MISSING', 'DISPOSED'] as AssetStatus[]).map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setNewStatus(s)}
                              className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                newStatus === s
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {STATUS_CONFIG[s].label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
                        <Input
                          value={moveOutNotes}
                          onChange={e => setMoveOutNotes(e.target.value)}
                          placeholder="Describe condition at move-out"
                          className="text-sm bg-white"
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button onClick={saveMoveOut} className="flex-1 h-10 font-bold text-sm">Save Move-Out Record</Button>
                        <Button variant="outline" onClick={() => setEditingMoveOut(false)} className="h-10 font-bold text-sm">Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary CTAs */}
                {!editingMoveOut && (
                  <div className="space-y-2 pt-2">
                    <Button
                      onClick={() => setEditingMoveOut(true)}
                      className="w-full h-12 font-black text-base"
                    >
                      <ClipboardList className="w-4 h-4 text-amber-400 mr-2" />
                      {activeInspector.moveOutCondition ? 'Update Move-Out Condition' : 'Record Move-Out Condition'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        deleteAsset(activeInspector.id);
                        setActiveInspector(null);
                      }}
                      className="w-full h-10 font-bold text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-slate-200"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove from Inventory
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Modal */}
      <AddAssetModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};
